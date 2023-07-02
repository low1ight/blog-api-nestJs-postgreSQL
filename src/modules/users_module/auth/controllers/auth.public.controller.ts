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
import { CreateUserDto } from '../../users/controllers/dto/CreateUserDto';
import { RegisterNewUserUseCaseCommand } from '../application/public/auth/useCase/register-new-user-use-case';
import { EmailConfirmationUseCaseCommand } from '../application/public/auth/useCase/email-confirmation-use-case';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../../utils/throwException';
import { EmailDto } from './dto/EmailDto';
import { RegistrationEmailResendingUseCaseCommand } from '../application/public/auth/useCase/registration-email-resending-use-case';
import { PasswordRecoveryUseCaseCommand } from '../application/public/auth/useCase/password-recovery-use-case';
import { NewPasswordDto } from '../../users/controllers/dto/NewPasswordDto';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { SetNewPasswordUseCaseCommand } from '../../users/application/use-cases/set-new-password-use-case';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle(5, 10)
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
  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() dto: { code: string }) {
    const result: CustomResponse<string | null> = await this.commandBus.execute(
      new EmailConfirmationUseCaseCommand(dto.code),
    );
    if (!result.isSuccess)
      Exceptions.throwHttpException(result.errStatusCode, result.content);
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() dto: EmailDto) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new RegistrationEmailResendingUseCaseCommand(dto.email),
    );
    if (!result.isSuccess)
      Exceptions.throwHttpException(
        result.errStatusCode,
        result.content,
        'email',
      );
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

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailDto) {
    return await this.commandBus.execute(
      new PasswordRecoveryUseCaseCommand(dto.email),
    );
  }

  @Post('new-password')
  @HttpCode(204)
  async newPassword(@Body() dto: NewPasswordDto) {
    const result = await this.commandBus.execute(
      new SetNewPasswordUseCaseCommand(dto),
    );
    if (!result)
      Exceptions.throwHttpException(
        CustomResponseEnum.badRequest,
        'invalid recovery code',
      );
  }
}
