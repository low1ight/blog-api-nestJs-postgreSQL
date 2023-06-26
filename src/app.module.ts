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
import { UsersRepository } from './modules/users_module/users/repositories/users.repository';
import { DeleteUserUseCase } from './modules/users_module/users/application/sa/use-cases/delete-user-use-case';
import { SetBanStatusForUserUseCase } from './modules/users_module/users/application/sa/use-cases/set-ban-status-for-user-use-case';
import { UsersQueryRepository } from './modules/users_module/users/repositories/sa/query-repository/users.query.repository';
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

const customValidators = [IsUserLoginAlreadyExist, IsUserEmailAlreadyExist];
const useCases = [
  DeleteAllOtherDevicesUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  LogoutUseCase,
  LoginUseCase,
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
    AppService,
    AuthQueryRepository,
    LocalStrategy,
    UsersQueryRepository,
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
