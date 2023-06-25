import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DevicesService } from '../application/public/devices/devices.service';

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['refreshToken'];
  }

  return jwt;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly devicesService: DevicesService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const isCurrentSessionValid =
      await this.devicesService.isSessionIdForDeviceValid(
        payload.deviceId,
        payload.sessionId,
      );
    if (!isCurrentSessionValid) throw new UnauthorizedException();

    return { ...payload };
  }
}
