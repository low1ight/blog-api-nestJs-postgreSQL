import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'process';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    if (
      process.env.HTTP_BASIC_LOGIN === username &&
      process.env.HTTP_BASIC_PASS === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
