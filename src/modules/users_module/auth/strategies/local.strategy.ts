import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPublicService } from '../application/public/auth.public.service';
import { UserForLoginValidationModel } from '../../users/repositories/dto/UserForLoginValidationModel';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthPublicService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user: UserForLoginValidationModel | null =
      await this.authService.validateUser(loginOrEmail, password);
    if (!user) {
      throw new UnauthorizedException('wrong email or login');
    }
    if (!user.isConfirmed) {
      throw new UnauthorizedException('email is not confirmed');
    }
    if (user.isBanned) {
      throw new UnauthorizedException('user has been banned');
    }
    return user;
  }
}
