import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersSaController } from './modules/users/controllers/sa/users.sa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSaRepository } from './modules/users/repositories/repository/sa/users.sa.repository';
import { UsersSaService } from './modules/users/application/users.sa.service';
import { TestingService } from './modules/testing/testing.service';
import { TestingRepository } from './modules/testing/repositories/repository/testing.repository';
import { TestingController } from './modules/testing/controllers/testing.controller';
import { UsersQueryRepository } from './modules/users/repositories/query-repository/sa/users-query-repository';
import {
  IsUserEmailAlreadyExist,
  IsUserLoginAlreadyExist,
} from './common/customValidators/IsUserFieldsExist';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './modules/users/application/use-cases/create-user-use-case';

const customValidators = [IsUserLoginAlreadyExist, IsUserEmailAlreadyExist];
const useCases = [CreateUserUseCase];
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
    UsersSaService,
    UsersSaRepository,
    TestingService,
    TestingRepository,
    ...customValidators,
    ...useCases,
  ],
})
export class AppModule {}
