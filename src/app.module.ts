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
import { LoginUseCase } from './modules/users_module/auth/application/public/useCase/login-use-case';
import { DevicesPublicRepository } from './modules/users_module/auth/repositories/public/devices.public.repository.service';
import { AuthPublicService } from './modules/users_module/auth/application/public/auth.public.service';

const customValidators = [IsUserLoginAlreadyExist, IsUserEmailAlreadyExist];
const useCases = [CreateUserUseCase, DeleteUserUseCase, LoginUseCase];
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
    TestingController,
    AuthPublicController,
  ],
  providers: [
    BasicStrategy,
    AppService,
    LocalStrategy,
    UsersQueryRepository,
    UsersService,
    UsersSaRepository,
    TestingService,
    DevicesPublicRepository,
    JwtAdapter,
    PasswordHashAdapter,
    TestingRepository,
    UsersRepository,
    AuthPublicService,
    SetBanStatusForUserUseCase,
    ...customValidators,
    ...useCases,
  ],
})
export class AppModule {}
