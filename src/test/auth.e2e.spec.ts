import { INestApplication } from '@nestjs/common';
import { TestingRepository } from '../modules/testing/repositories/repository/testing.repository';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { EmailManager } from '../adapters/email.manager';
import { CreateUserDto } from '../modules/users_module/users/controllers/dto/CreateUserDto';
import request from 'supertest';
import { UserSaViewModel } from '../modules/users_module/users/repositories/query-repository/dto/UserSaViewModel';
import process from 'process';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';

describe('users controller testing', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const mockedEmailManager = {
    sendConfirmationCode: jest.fn(),
    sendPasswordRecoveryCode: jest.fn(),
  };

  let testingRepository: TestingRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailManager)
      .useValue(mockedEmailManager)
      .compile();

    dataSource = moduleRef.get<DataSource>(DataSource);
    testingRepository = moduleRef.get<TestingRepository>(TestingRepository);
    await testingRepository.deleteAllData();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //variables for testing
  //
  //
  let createdUserId: number;
  let correctConfirmationCode: string;
  let recoveryCode;
  let cookie;
  let newCookie;

  const newPassword = '321321';

  const registerUserDto: CreateUserDto = {
    login: 'tempLogin',
    password: '123123',
    email: 'secrofeasy@gmail.com',
  };

  const loginDto = {
    loginOrEmail: registerUserDto.login,
    password: registerUserDto.password,
  };

  const createdUser: UserSaViewModel = {
    id: expect.any(String),
    login: 'tempLogin',
    createdAt: expect.any(String),
    email: 'secrofeasy@gmail.com',
    banInfo: {
      isBanned: false,
      banDate: null,
      banReason: null,
    },
  };

  it('register user', () => {
    return request(app.getHttpServer())
      .post('/auth/registration')
      .send(registerUserDto)
      .expect(204);
  });

  it('should created user with paginator', () => {
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

        createdUserId = response.body.items[0]?.id;
      });
  });

  it('should return 401 for created user with unconfirmed email', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401);
  });

  it('should return 400 for incorrect confirmation code', () => {
    return request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code: 'bad code' })
      .expect(400);
  });

  it('should set new confirmation code', async () => {
    const confirmationCode = await dataSource.query(`
    SELECT "confirmationCode"
    FROM "UsersEmailConfirmation"
    WHERE "ownerId" = ${createdUserId}

    `);

    await request(app.getHttpServer())
      .post('/auth/registration-email-resending')
      .send({ email: createdUser.email })
      .expect(204);

    const newConfirmationCode = await dataSource.query(`
    SELECT "confirmationCode"
    FROM "UsersEmailConfirmation"
    WHERE "ownerId" = ${createdUserId}

    `);

    expect(confirmationCode[0]?.confirmationCode).not.toEqual(
      newConfirmationCode[0]?.confirmationCode,
    );

    correctConfirmationCode = newConfirmationCode[0]?.confirmationCode;
  });

  it('should confirm email code', async () => {
    return request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code: correctConfirmationCode })
      .expect(204);
  });

  it('should successful login and return AT in body and RT in cookie', () => {
    return (
      request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        // .expect('refreshToken', expect.any(String))
        .then((response) => {
          expect(response.body).toEqual({
            accessToken: expect.any(String),
          });

          const refreshTokenCookie = response.headers['set-cookie']
            .map((cookie) => cookie.split(';')[0]) // Extract the cookie value only
            .find((cookie) => cookie.includes('refreshToken'))
            .split('=')[1];

          cookie = response.headers['set-cookie'];

          refreshToken = refreshTokenCookie;
          accessToken = response.body.accessToken;
        })
    );
  });

  it('should successful return me data', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          userId: expect.any(String),
          login: createdUser.login,
          email: createdUser.email,
        });
      });
  });

  it('should set new recovery code', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({ email: createdUser.email })
      .expect(204);

    const response = await dataSource.query(`
    SELECT "passwordRecoveryCode"
    FROM "Users"
    WHERE "id" = ${createdUserId}

    `);

    recoveryCode = response[0].passwordRecoveryCode;

    expect(recoveryCode).toEqual(expect.any(String));
  });

  it('set new password', async () => {
    return request(app.getHttpServer())
      .post('/auth/new-password')
      .send({ newPassword: newPassword, recoveryCode: recoveryCode })
      .expect(204);
  });

  it('should return 400 while login with old password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401);
  });

  it('should successful login with new password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: loginDto.loginOrEmail, password: newPassword })
      .expect(200);
  });

  it('should return new tokens', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', cookie)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          accessToken: expect.any(String),
        });

        newCookie = response.headers['set-cookie'];
      });
  });

  it('should return new tokens', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', cookie)
      .expect(401);
  });

  it('should return new tokens', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', newCookie)
      .expect(204);
  });
  it('refresh token should be expired', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', newCookie)
      .expect(401);
  });
});
