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
    questions.forEach((question) => {
      const quizGameQuestion = new QuizGameQuestion();
      quizGameQuestion.quizGameId = gameId;
      quizGameQuestion.questionId = question;
      quizGameQuestionsArr.push(quizGameQuestion);
    });
    await this.quizGamesQuestionsRepository.save(quizGameQuestionsArr);
  }
}
