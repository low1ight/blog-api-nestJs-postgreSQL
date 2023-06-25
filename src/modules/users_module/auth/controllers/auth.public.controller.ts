import { Controller, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { LoginUseCaseCommand } from '../application/public/useCase/login-use-case';

@Controller('auth')
export class AuthPublicController {
  constructor(private commandBus: CommandBus) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { id, login } = req.user;
    const title = req.headers['user-agent'];
    const { refreshToken, accessToken } = await this.commandBus.execute(
      new LoginUseCaseCommand(id, login, title, ip),
    );

    response.cookie('refreshToken ', refreshToken, {
      // httpOnly: true,
      // secure: true,
    });

    return { accessToken };
  }
}