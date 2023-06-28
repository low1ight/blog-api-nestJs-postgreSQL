import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { RefreshRtUseCaseCommand } from '../application/public/auth/useCase/refresh-rt-use-case';
import { CreateUserDto } from '../../users/controllers/sa/dto/CreateUserDto';
import { RegisterNewUserUseCaseCommand } from '../application/public/auth/useCase/register-new-user-use-case';

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

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() dto: CreateUserDto) {
    await this.commandBus.execute(new RegisterNewUserUseCaseCommand(dto));
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshTokens(
    @CurrentUser() { deviceId, userId, login }: UserDataFromRT,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } = await this.commandBus.execute(
      new RefreshRtUseCaseCommand(userId, deviceId, login),
    );

    response.cookie('refreshToken ', refreshToken, {
      // httpOnly: true,
      // secure: true,
    });

    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() { id }: UserDataFromAT) {
    return await this.authQueryRepository.getUserDataForAuthMe(id);
  }
}
