import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizGamePlayerAnswer } from '../../entity/QuizGamePlayerAnswer.entity';
import { Repository } from 'typeorm';
import { AnswerQuestionDto } from '../../controllers/dto/AnswerQuestionDto';
import { QuizGamePlayerProgressAnswerViewModel } from '../query-repository/dto/view_models/QuizGamePlayerProgressAnswerViewModel';

@Injectable()
export class QuizGamePlayerAnswersRepo {
  constructor(
    @InjectRepository(QuizGamePlayerAnswer)
    private readonly quizGamePlayerAnswersRepository: Repository<QuizGamePlayerAnswer>,
  ) {}

  async getPlayerAnswersInGameById(playerId: number, gameId: string) {
    return await this.quizGamePlayerAnswersRepository.countBy({
      playerId,
      gameId,
    });
  }

  async addQuestionAnswer(
    playerId: number,
    gameId: string,
    questionId: string,
    dto: AnswerQuestionDto,
    isAnswerCorrect: boolean,
  ) {
    const answer = new QuizGamePlayerAnswer();
    answer.gameId = gameId;
    answer.playerId = playerId;
    answer.questionAnswer = dto.answer;
    answer.questionId = questionId;
    answer.addedAt = new Date();

    const createdAnswer = await this.quizGamePlayerAnswersRepository.save(
      answer,
    );

    return new QuizGamePlayerProgressAnswerViewModel(
      questionId,
      isAnswerCorrect,
      createdAnswer.addedAt,
    );
  }
}
