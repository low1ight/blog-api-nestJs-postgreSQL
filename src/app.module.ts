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
import { UsersQueryRepository } from './modules/users_module/users/repositories/sa/query-repository/users-query-repository';
import {
  IsUserEmailAlreadyExist,
  IsUserLoginAlreadyExist,
} from './common/customValidators/IsUserFieldsExist';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './modules/users_module/users/application/sa/use-cases/create-user-use-case';
import { PasswordHashAdapter } from './modules/users_module/adapters/passwordHash.adapter';
import { UsersRepository } from './modules/users_module/users/repositories/users.repository';
import { DeleteUserUseCase } from './modules/users_module/users/application/sa/use-cases/delete-user-use-case';

const customValidators = [IsUserLoginAlreadyExist, IsUserEmailAlreadyExist];
const useCases = [CreateUserUseCase, DeleteUserUseCase];
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
    CqrsModule,
  ],
  controllers: [AppController, UsersSaController, TestingController],
  providers: [
    AppService,
    UsersQueryRepository,
    UsersService,
    UsersSaRepository,
    TestingService,
    PasswordHashAdapter,
    TestingRepository,
    UsersRepository,
    ...customValidators,
    ...useCases,
  ],
})
export class AppModule {}
