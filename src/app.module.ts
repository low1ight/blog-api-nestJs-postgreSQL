import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './modules/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersQueryRepository } from './modules/users/repository/users-query-repository.service';
import { UsersRepository } from './modules/users/repository/users.repository';

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
  controllers: [AppController, UsersController],
  providers: [AppService, UsersQueryRepository, UsersRepository],
})
export class AppModule {}
