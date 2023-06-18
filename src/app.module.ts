import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersSaController } from './modules/users/controllers/sa/users.sa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersQueryRepository } from './modules/users/repositories/query-repository/sa/users-query-repository.service';
import { UsersSaRepository } from './modules/users/repositories/repository/sa/users.sa.repository';
import { UsersService } from './modules/users/users.service';
import { TestingService } from './modules/testing/testing.service';
import { TestingRepository } from './modules/testing/repositories/repository/testing.repository';
import { TestingController } from './modules/testing/controllers/testing.controller';

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
  ],
  controllers: [AppController, UsersSaController, TestingController],
  providers: [
    AppService,
    UsersQueryRepository,
    UsersService,
    UsersSaRepository,
    TestingService,
    TestingRepository,
  ],
})
export class AppModule {}
