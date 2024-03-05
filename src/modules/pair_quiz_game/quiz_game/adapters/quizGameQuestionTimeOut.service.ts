import { Injectable } from '@nestjs/common';

import { QuizGamePlayerAnswerService } from '../application/quizGamePlayerAnswer.service';

@Injectable()
export class QuizGameQuestionTimeOutService {
  constructor(
    private readonly quizGamePlayerAnswerService: QuizGamePlayerAnswerService,
  ) {}

  private gamesTimeouts = new Map<number, NodeJS.Timeout>();

  async setTimeOutForGame(playerId: number, answerNumber = 1) {
    const startTime = new Date();
    const timeout = setTimeout(async () => {
      //add new timeout

      this.stopTimeOut(playerId);
      this.gamesTimeouts.set(playerId, timeout);

      const result = await this.quizGamePlayerAnswerService.answerQuestion(
        playerId,
        { answer: 'TimeOut' },
      );

      console.log('question ' + answerNumber + ' answered by ' + playerId);

      //check for creating timeout for next question
      const endTime = new Date();
      const timeTaken = endTime.getTime() - startTime.getTime();
      console.log(timeTaken);

      if (
        result.isSuccess &&
        answerNumber < Number(process.env.QUIZ_GAME_QUESTION_COUNT)
      ) {
        console.log('create timeout for question number ' + (answerNumber + 1));
        return this.setTimeOutForGame(playerId, answerNumber + 1);
      }
      console.log('question list it empty, remove timeout from list');
      return this.stopTimeOut(playerId);

      //check is we have question for answer
      // if (answerNumber > Number(process.env.QUIZ_GAME_QUESTION_COUNT))
      //   return this.stopTimeOut(playerId);
      // const result = await this.quizGamePlayerAnswerService.answerQuestion(
      //   playerId,
      //   { answer: 'TimeOut' },
      // );
      //if adding answer was unsuccessful remove TimeOut!
      // if (!result.isSuccess) return this.stopTimeOut(playerId);

      //if there is one more question for answer, create new timer

      // if (answerNumber + 1 <= Number(process.env.QUIZ_GAME_QUESTION_COUNT)) {
      //   console.log('create timeout ' + playerId);
      //   return await this.setTimeOutForGame(playerId, answerNumber + 1);
      // }

      //if we don't have for answer, remove timeout

      // console.log('stop creating timeouts ' + playerId);
      // return this.stopTimeOut(playerId);
    }, Number(process.env.QUIZ_GAME_TIME_FOR_ANSWER_QUESTION));
    this.gamesTimeouts.set(playerId, timeout);
  }

  stopTimeOut(userId: number) {
    //console.log(userId);
    //console.log(this.gamesTimeouts);
    const timeout = this.gamesTimeouts.get(userId);
    if (timeout) {
      console.log('try to clear');
      clearTimeout(timeout);
      this.gamesTimeouts.delete(userId);
    }
  }

  // isQuestionWasAnsweredOnTime() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const value = 10;
  //       console.log(value);
  //       if (value === 10) return this.isQuestionWasAnsweredOnTime();
  //     }, 5000); // 10000 миллисекунд = 10 секунд
  //   });
  // }
}
