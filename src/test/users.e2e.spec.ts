import { TestingRepository } from '../modules/testing/repositories/repository/testing.repository';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import * as process from 'process';
import { CreateUserDto } from '../modules/users_module/users/controllers/dto/CreateUserDto';
import { AppModule } from '../app.module';
import { UserSaViewModel } from '../modules/users_module/users/repositories/query-repository/dto/UserSaViewModel';
import { BanUserDto } from '../modules/users_module/users/controllers/dto/BanUserDto';

describe('users controller testing', () => {
  let app: INestApplication;
  let testingRepository: TestingRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    testingRepository = moduleRef.get<TestingRepository>(TestingRepository);
    await testingRepository.deleteAllData();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //variables for testing
  //
  //

  let createdUserId: string;

  const createUserDto: CreateUserDto = {
    login: 'tempLogin',
    password: '123123',
    email: 'temp@mail.com',
  };

  const createdUser: UserSaViewModel = {
    id: expect.any(String),
    login: 'tempLogin',
    createdAt: expect.any(String),
    email: 'temp@mail.com',
    banInfo: {
      isBanned: false,
      banDate: null,
      banReason: null,
    },
  };

  const banUserData: BanUserDto = {
    isBanned: true,
    banReason: 'testing ban reason. for end to end testing',
  };

  const unbanUserData: BanUserDto = {
    isBanned: false,
    banReason: 'testing ban reason. for end to end testing',
  };

  const bannedUser: UserSaViewModel = {
    id: expect.any(String),
    login: 'tempLogin',
    createdAt: expect.any(String),
    email: 'temp@mail.com',
    banInfo: {
      isBanned: true,
      banDate: expect.any(String),
      banReason: banUserData.banReason,
    },
  };

  //tests
  //
  //

  it('should return 401 without basic auth data', () => {
    return request(app.getHttpServer()).get('/sa/users').expect(401);
  });

  it('should return an empty arr with pagination', () => {
    return request(app.getHttpServer())
      .get('/sa/users')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
  });

  it('should return a successful created user view model', () => {
    return request(app.getHttpServer())
      .post('/sa/users')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send(createUserDto)
      .expect(201)
      .then((response) => {
        createdUserId = response.body.id;
        expect(response.body).toEqual(createdUser);
      });
  });

  it('should unban user', () => {
    console.log(createdUserId);
    return request(app.getHttpServer())
      .put(`/sa/users/${createdUserId}/ban`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send(banUserData)
      .expect(204);
  });

  it('should return banned user with pagination', () => {
    return request(app.getHttpServer())
      .get('/sa/users')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          items: [bannedUser],
        });
      });
  });

  it('should ban user', () => {
    return request(app.getHttpServer())
      .put(`/sa/users/${createdUserId}/ban`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send(unbanUserData)
      .expect(204);
  });

  it('should return un banned user with pagination', () => {
    return request(app.getHttpServer())
      .get('/sa/users')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          items: [createdUser],
        });
      });
  });

  it('should delete user', () => {
    return request(app.getHttpServer())
      .delete(`/sa/users/${createdUserId}`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(204);
  });

  it('should return un banned user with pagination', () => {
    return request(app.getHttpServer())
      .get('/sa/users')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          items: [],
        });
      });
  });
});
