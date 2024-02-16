import { InjectRepository } from '@nestjs/typeorm';
import { QuizGame } from '../../entity/QuizGame.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class QuizGameRepo {
  constructor(
    @InjectRepository(QuizGame)
    private readonly quizGameRepository: Repository<QuizGame>,
  ) {}

  async createNewQuizGame(userId: number) {
    const quizGame = new QuizGame();

    quizGame.firstPlayerId = userId;
    quizGame.secondPlayerId = null;
    quizGame.pairCreatedDate = new Date();
    quizGame.startGameDate = null;
    quizGame.finishGameDate = null;
    quizGame.status = 'PendingSecondPlayer';

    await this.quizGameRepository.save(quizGame);
  }

  async isUserHaveNotFinishedGame(userId: number) {
    return await this.quizGameRepository
      .createQueryBuilder('QuizGame')
      .where('NOT QuizGame.status = :status', { status: 'finished' })
      .andWhere(
        'QuizGame.firstPlayerId = :userId OR QuizGame.secondPlayerId = :userId',
        { userId },
      )
      .getExists();
  }

  async findGameWhatPendingSecondPlayer() {
    const game = await this.quizGameRepository
      .createQueryBuilder('QuizGame')
      .where('QuizGame.status = :status', { status: 'PendingSecondPlayer' })
      .getOne();

    return game?.id || null;
  }

  async connectToGameWhatPendingSecondPlayer(gameId: string, userId: number) {
    const game = await this.quizGameRepository.findOneBy({ id: gameId });
    game.secondPlayerId = userId;
    game.startGameDate = new Date();
    game.status = 'Active';
    await this.quizGameRepository.save(game);
  }
}
