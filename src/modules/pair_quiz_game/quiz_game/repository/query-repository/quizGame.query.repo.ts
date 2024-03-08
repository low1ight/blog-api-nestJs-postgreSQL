import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizGame } from '../../entity/QuizGame.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { QuizGameStartViewModel } from './dto/view_models/QuizGameStartViewModel';
import { QuizGameDBType } from './dto/QuizGameDBType';
import { QuizGamePendingViewModel } from './dto/view_models/QuizGamePendingViewModel';

@Injectable()
export class QuizGameQueryRepo {
  constructor(
    @InjectRepository(QuizGame)
    private readonly quizGameRepository: Repository<QuizGame>,
  ) {}

  // async getPendingForPlayerGame(gameId: string) {
  //   const game: QuizGameDBType = await this.quizGameRepository
  //     .createQueryBuilder('game')
  //     .where('game.id = :id', { id: gameId })
  //     .select([
  //       'game.id',
  //       'game.status',
  //       'game.pairCreatedDate',
  //       'game.startGameDate',
  //       'game.finishGameDate',
  //     ])
  //     .leftJoin('game.firstPlayer', 'fp')
  //     .addSelect(['fp.id', 'fp.login'])
  //     .getOne();
  //
  //   return new QuizGameStartViewModel(game);
  // }

  async getNotFinishedGameByUserId(userId: number) {
    const queryBuilder: SelectQueryBuilder<QuizGame> = this.quizGameRepository
      .createQueryBuilder('game')
      .where('game."firstPlayerId" = :id OR game."secondPlayerId" = :id', {
        id: userId,
      })
      .andWhere('NOT game.status = :status', { status: 'Finished' });

    return await this.getGame(queryBuilder);
  }

  async getGameByGameIdAndUserId(gameId: string, userId: number) {
    const queryBuilder: SelectQueryBuilder<QuizGame> = this.quizGameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: gameId })
      .andWhere(
        'game."firstPlayerId" = :userId OR game."secondPlayerId" = :userId',
        {
          userId,
        },
      );

    return await this.getGame(queryBuilder);
  }

  async isGameExistById(gameId: string): Promise<boolean> {
    return await this.quizGameRepository.exist({
      where: {
        id: gameId,
      },
    });
  }

  private async getGame(query: SelectQueryBuilder<QuizGame>) {
    const game: QuizGameDBType | null = await query
      .select([
        'game.id',
        'game.status',
        'game.pairCreatedDate',
        'game.startGameDate',
        'game.finishGameDate',
      ])
      .leftJoinAndSelect('game.playerAnswers', 'pa')
      .orderBy('pa."addedAt"', 'ASC')
      .leftJoin('game.firstPlayer', 'fp')
      .addSelect(['fp.id', 'fp.login'])
      .leftJoin('game.secondPlayer', 'sp')
      .addSelect(['sp.id', 'sp.login'])
      .leftJoinAndSelect('game.questions', 'questions')
      .addOrderBy('questions."questionNumber"', 'ASC')
      .leftJoin('questions.question', 'question')
      .addSelect(['question.id', 'question.body', 'question.correctAnswers'])
      .getOne();

    if (!game) return null;

    //return game;

    return game.status === 'PendingSecondPlayer'
      ? new QuizGamePendingViewModel(game)
      : new QuizGameStartViewModel(game);
  }
}
