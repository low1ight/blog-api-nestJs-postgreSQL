import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
@Injectable()
export class JwtAdapter {
  constructor(private readonly jwtService: JwtService) {}
  async createJwtTokens(userId, login, deviceId, sessionId) {
    const [at, rt]: string[] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId, userName: login },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME },
      ),
      this.jwtService.signAsync(
        { userId, login, deviceId, sessionId },
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
