import { Controller, Get, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { LoginUseCaseCommand } from '../application/public/auth/useCase/login-use-case';
import { RefreshTokenGuard } from '../guards/refresh.token.guard.';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromRT } from '../../../../common/decorators/currentUser/UserDataFromRT';
import { LogoutUseCaseCommand } from '../application/public/auth/useCase/logout-use-case';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { AuthQueryRepository } from '../application/public/auth/query-repo/auth.query.repository';

@Controller('auth')
export class AuthPublicController {
  constructor(
    private commandBus: CommandBus,
    private authQueryRepository: AuthQueryRepository,
  ) {}
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

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@CurrentUser() { deviceId }: UserDataFromRT) {
    await this.commandBus.execute(new LogoutUseCaseCommand(deviceId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() { id }: UserDataFromAT) {
    return await this.authQueryRepository.getUserDataForAuthMe(id);
  }
}
