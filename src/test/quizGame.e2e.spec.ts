import { TestingRepository } from '../modules/testing/repositories/repository/testing.repository';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import * as process from 'process';
import { AppModule } from '../app.module';

describe('users controller testing', () => {
  let app: INestApplication;
  let testingRepository: TestingRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    testingRepository = moduleRef.get<TestingRepository>(TestingRepository);
    await testingRepository.deleteQuizGames();
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

  const userNames: string[] = [];
  const userAccessTokensArr = [];
  const questionsId = [];

  //tests
  //
  //

  it('create 10 users for testing', async () => {
    for (let i = 1; i <= 10; i++) {
      await request(app.getHttpServer())
        .post('/sa/users')
        .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
          type: 'basic',
        })
        .send({
          login: 'user' + i,
          password: '123123',
          email: `user${i}mail@gmail.com`,
        })
        .expect(201)
        .then((response) => {
          userNames.push(response.body.login);
        });
    }

    expect(userNames.length).toEqual(10);
  });

  it('login and get tokens for these users', async () => {
    for (const name of userNames) {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          loginOrEmail: name,
          password: '123123',
        })
        .expect(200)
        .then((response) => {
          userAccessTokensArr.push(response.body.accessToken);
        });
    }

    expect(userAccessTokensArr.length).toEqual(10);
  });

  it('create 5 question', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
          type: 'basic',
        })
        .send({
          body: 'question ' + i,
          correctAnswers: ['correct'],
        })
        .expect(201)
        .then((response) => {
          questionsId.push(response.body.id);
        });
    }
  });
  it('publish 4 question', async () => {
    for (let i = 0; i < 4; i++) {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionsId[i]}/publish`)
        .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
          type: 'basic',
        })
        .send({
          published: true,
        })
        .expect(204);
    }
  });
  it('should return 404 if not enough published questions (for game should be at least 5)', async () => {
    await request(app.getHttpServer())
      .post(`/pair-game-quiz/pairs/connection`)
      .auth(userAccessTokensArr[0], { type: 'bearer' })
      .expect(404);
  });
  it('publish last question', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionsId[4]}/publish`)
      .auth(process.env.HTTP_BASIC_LOGIN, process.env.HTTP_BASIC_PASS, {
        type: 'basic',
      })
      .send({
        published: true,
      })
      .expect(204);
  });
  it('must create new game, because there are enough published question for start the game, and there are no lobby for connecting', async () => {
    await request(app.getHttpServer())
      .post(`/pair-game-quiz/pairs/connection`)
      .auth(userAccessTokensArr[0], { type: 'bearer' })
      .expect(201);
  });
});
