import { TestingRepository } from '../modules/testing/repositories/repository/testing.repository';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
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

    app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
          const errorsArr = [];

          errors.forEach((error) => {
            const errorsMessagesKeys = Object.keys(error.constraints);

            errorsMessagesKeys.forEach((key) => {
              errorsArr.push({
                message: error.constraints[key],
                field: error.property,
              });
            });
          });

          throw new BadRequestException(errorsArr);
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //variables for testing
  //
  //

  const userAccessTokensArr = {
    id: expect.any(String),
    body: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    published: false,
    correctAnswers: expect.arrayContaining([expect.any(String)]),
  };

  let createdQuestionId: string;

  //tests
  //
  //

  it('should get 401 when try create without auth', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send({})
      .expect(401);
  });

  it('status 400 must be at least 1 answer in arr', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send({
        body: '1 + 6',
        correctAnswers: [],
      })
      .expect(400);
  });
  it('status 400, answers must be only string', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send({
        body: '1 + 6',
        correctAnswers: [7],
      })
      .expect(400);
  });
  it('should create question', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send({
        body: '1 + 6',
        correctAnswers: ['7', 'seven'],
      })
      .expect(201)
      .then((response) => {
        createdQuestionId = response.body.id;
        expect(response.body).toEqual(userAccessTokensArr);
      });
  });

  it('must be 400 without body', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${createdQuestionId}/publish`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(400);
  });
  it('should successful set status with status code 204', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${createdQuestionId}/publish`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send({ published: true })
      .expect(204);
  });
  it('should get question with changed publish status', async () => {
    await request(app.getHttpServer())
      .get(`/sa/quiz/questions`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.items[0].published).toEqual(true);
      });
  });
  it('should change question data', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${createdQuestionId}`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send({
        body: '5 + 5',
        correctAnswers: ['10'],
      })
      .expect(204);
  });
  it('should get question with changed data', async () => {
    await request(app.getHttpServer())
      .get(`/sa/quiz/questions`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.items[0].body).toEqual('5 + 5');
        expect(response.body.items[0].correctAnswers).toEqual(['10']);
      });
  });
  it('should successful delete the question with status 204', async () => {
    await request(app.getHttpServer())
      .delete(`/sa/quiz/questions/${createdQuestionId}`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(204);
  });
  it('should return and empty arr', async () => {
    await request(app.getHttpServer())
      .get(`/sa/quiz/questions`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.items.length).toEqual(0);
      });
  });
});
