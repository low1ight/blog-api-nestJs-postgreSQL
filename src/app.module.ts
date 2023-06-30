import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersSaController } from './modules/users_module/users/controllers/sa/users.sa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSaRepository } from './modules/users_module/users/repositories/sa/repository/users.sa.repository';
import { UsersService } from './modules/users_module/users/application/users.service';
import { TestingService } from './modules/testing/testing.service';
import { TestingRepository } from './modules/testing/repositories/repository/testing.repository';
import { TestingController } from './modules/testing/controllers/testing.controller';
import {
  IsUserEmailAlreadyExist,
  IsUserLoginAlreadyExist,
} from './common/customValidators/IsUserFieldsExist';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './modules/users_module/users/application/sa/use-cases/create-user-use-case';
import { PasswordHashAdapter } from './modules/users_module/adapters/passwordHash.adapter';
import { UsersRepository } from './modules/users_module/users/repositories/public/repository/users.repository';
import { DeleteUserUseCase } from './modules/users_module/users/application/sa/use-cases/delete-user-use-case';
import { SetBanStatusForUserUseCase } from './modules/users_module/users/application/sa/use-cases/set-ban-status-for-user-use-case';
import { UsersSaQueryRepository } from './modules/users_module/users/repositories/sa/query-repository/users-sa-query-repository.service';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './modules/users_module/auth/strategies/basic.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from './modules/users_module/auth/adapters/jwt.adapter';
import { AuthPublicController } from './modules/users_module/auth/controllers/auth.public.controller';
import { LocalStrategy } from './modules/users_module/auth/strategies/local.strategy';
import { LoginUseCase } from './modules/users_module/auth/application/public/auth/useCase/login-use-case';
import { AuthPublicService } from './modules/users_module/auth/application/public/auth/auth.public.service';
import { DevicePublicController } from './modules/users_module/auth/controllers/device.public.controller';
import { AccessTokenStrategy } from './modules/users_module/auth/strategies/accessToken.strategy';
import { DevicesPublicRepository } from './modules/users_module/auth/repositories/public/devices/devices.public.repository';
import { DevicesPublicQueryRepository } from './modules/users_module/auth/repositories/public/devices/query-repo/devices.public.query.repository';
import { RefreshTokenStrategy } from './modules/users_module/auth/strategies/refreshToken.strategy';
import { DevicesService } from './modules/users_module/auth/application/public/devices/devices.service';
import { DeleteAllOtherDevicesUseCase } from './modules/users_module/auth/application/public/devices/use-case/delete-all-other-devices-use-case';
import { DeleteDeviceByIdUseCase } from './modules/users_module/auth/application/public/devices/use-case/delete-device-by-id-use-case';
import { LogoutUseCase } from './modules/users_module/auth/application/public/auth/useCase/logout-use-case';
import { AuthQueryRepository } from './modules/users_module/auth/application/public/auth/query-repo/auth.query.repository';
import { RefreshRtUseCase } from './modules/users_module/auth/application/public/auth/useCase/refresh-rt-use-case';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './adapters/email.manager';
import { UsersEmailConfirmationRepository } from './modules/users_module/users/repositories/public/repository/usersEmailConfirmation.repository';
import { UsersBanInfoRepository } from './modules/users_module/users/repositories/public/repository/usersBanInfo.repository';
import { UsersPublicQueryRepository } from './modules/users_module/users/repositories/public/query-repo/users-public-query-repository.service';
import { RegisterNewUserUseCase } from './modules/users_module/auth/application/public/auth/useCase/register-new-user-use-case';
import { EmailConfirmationUseCase } from './modules/users_module/auth/application/public/auth/useCase/email-confirmation-use-case';
import { RegistrationEmailResendingUseCase } from './modules/users_module/auth/application/public/auth/useCase/registration-email-resending-use-case';

const customValidators = [IsUserLoginAlreadyExist, IsUserEmailAlreadyExist];
const useCases = [
  DeleteAllOtherDevicesUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  RegisterNewUserUseCase,
  RefreshRtUseCase,
  LogoutUseCase,
  LoginUseCase,
  EmailConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  DeleteDeviceByIdUseCase,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodeJs',
      password: 'nodeJs',
      database: 'Blog',
      autoLoadEntities: false,
      synchronize: false,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    CqrsModule,
    PassportModule,
  ],
  controllers: [
    AppController,
    UsersSaController,
    DevicePublicController,
    TestingController,
    AuthPublicController,
  ],
  providers: [
    BasicStrategy,
    EmailManager,
    AppService,
    UsersEmailConfirmationRepository,
    UsersBanInfoRepository,
    AuthQueryRepository,
    LocalStrategy,
    UsersSaQueryRepository,
    UsersPublicQueryRepository,
    UsersService,
    AccessTokenStrategy,
    UsersSaRepository,
    TestingService,
    DevicesPublicRepository,
    DevicesPublicQueryRepository,
    JwtAdapter,
    PasswordHashAdapter,
    TestingRepository,
    UsersRepository,
    AuthPublicService,
    RefreshTokenStrategy,
    DevicesService,
    SetBanStatusForUserUseCase,
    ...customValidators,
    ...useCases,
  ],
})
export class AppModule {}
