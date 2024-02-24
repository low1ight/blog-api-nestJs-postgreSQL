import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizGameQuestion } from '../../entity/QuizGameQuestion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizGamesQuestionsRepo {
  constructor(
    @InjectRepository(QuizGameQuestion)
    private readonly quizGamesQuestionsRepository: Repository<QuizGameQuestion>,
  ) {}

  async addQuestionForQuizGame(questions: string[], gameId: string) {
    const quizGameQuestionsArr = [];
    let questionCount = 1;
    questions.forEach((question) => {
      const quizGameQuestion = new QuizGameQuestion();
      quizGameQuestion.quizGameId = gameId;
      quizGameQuestion.questionId = question;
      quizGameQuestion.questionNumber = questionCount;
      quizGameQuestionsArr.push(quizGameQuestion);
      questionCount++;
    });
    await this.quizGamesQuestionsRepository.save(quizGameQuestionsArr);
  }

  async getQuestionByGameIdAndQuestionNumber(
    gameId: string,
    questionNumber: number,
  ) {
    const question = await this.quizGamesQuestionsRepository
      .createQueryBuilder('gameQuestion')
      .where('gameQuestion.quizGameId = :gameId', { gameId })
      .andWhere('gameQuestion.questionNumber = :questionNumber', {
        questionNumber,
      })
      .leftJoin('gameQuestion.question', 'question')
      .addSelect(['question.id', 'question.body', 'question.correctAnswers'])
      .getOne();

    return {
      id: question.questionId,
      correctAnswers: question.question.correctAnswers,
    };
  }
}
