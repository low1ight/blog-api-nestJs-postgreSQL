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
}
