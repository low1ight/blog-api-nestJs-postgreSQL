import { Controller, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAdapter } from '../adapters/jwt.adapter';
import { LocalAuthGuard } from '../guards/local.auth.guard';

@Controller('auth')
export class AuthPublicController {
  constructor(private jwtAdapter: JwtAdapter) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const id = 5;
    // const { id, login } = req.user.userData;
    const login = 'test';
    const title = req.headers['user-agent'];
    return await this.jwtAdapter.createJwtTokens(id, login, title, ip);
  }
}
