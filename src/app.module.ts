import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersSaController } from './modules/users/controllers/sa/users.sa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersQueryRepository } from './modules/users/repositories/query-repository/users-query-repository.service';
import { UsersSaRepository } from './modules/users/repositories/repository/sa/users.sa.repository';
import { UsersService } from './modules/users/users.service';

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
  controllers: [AppController, UsersSaController],
  providers: [
    AppService,
    UsersQueryRepository,
    UsersService,
    UsersSaRepository,
  ],
})
export class AppModule {}
