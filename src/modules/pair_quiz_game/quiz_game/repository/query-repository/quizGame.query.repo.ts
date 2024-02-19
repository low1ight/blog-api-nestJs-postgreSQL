import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizGame } from '../../entity/QuizGame.entity';
import { Repository } from 'typeorm';
import { QuizGameViewModel } from './dto/view_models/QuizGameViewModel';
import { QuizGameDBType } from './dto/QuizGameDBType';

@Injectable()
export class QuizGameQueryRepo {
  constructor(
    @InjectRepository(QuizGame)
    private readonly quizGameRepository: Repository<QuizGame>,
  ) {}

  async getPendingForPlayerGame(gameId: string) {
    const game: QuizGameDBType = await this.quizGameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: gameId })
      .select([
        'game.id',
        'game.status',
        'game.pairCreatedDate',
        'game.startGameDate',
        'game.finishGameDate',
      ])
      .leftJoin('game.firstPlayer', 'fp')
      .addSelect(['fp.id', 'fp.login'])
      .getOne();

    return new QuizGameViewModel(game);
  }

  async getStartedGame(gameId: string) {
    const game: QuizGameDBType = await this.quizGameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: gameId })
      .select([
        'game.id',
        'game.status',
        'game.pairCreatedDate',
        'game.startGameDate',
        'game.finishGameDate',
      ])
      .leftJoin('game.firstPlayer', 'fp')
      .addSelect(['fp.id', 'fp.login'])
      .leftJoin('game.secondPlayer', 'sp')
      .addSelect(['sp.id', 'sp.login'])
      .leftJoinAndSelect('game.questions', 'questions')
      .orderBy('questions."questionNumber"', 'ASC')
      .leftJoin('questions.question', 'question')
      .addSelect(['question.id', 'question.body', 'question.correctAnswers'])
      .getOne();

    return new QuizGameViewModel(game);
  }
}
