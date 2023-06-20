import { UsersSaService } from '../modules/users_module/users_module-sa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { UsersSaRepository } from '../modules/users_module/users/repositories/sa/repository/sa/users.sa.repository';

describe('Testing describe', () => {
  let usersService: UsersSaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
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
      providers: [UsersSaService, UsersSaRepository],
    }).compile();

    usersService = moduleRef.get<UsersSaService>(UsersSaService);
  });

  it('base it', async () => {
    const ban = await usersService.createUser({
      login: 'new login',
      password: '123123',
      email: 'newEmail',
    });

    expect(ban[0].login).toBe('new login');
  });
});
