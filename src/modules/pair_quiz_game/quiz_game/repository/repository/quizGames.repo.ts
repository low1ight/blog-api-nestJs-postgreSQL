import { InjectRepository } from '@nestjs/typeorm';
import { QuizGame } from '../../entity/QuizGame.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class QuizGamesRepo {
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

    const game = await this.quizGameRepository.save(quizGame);
    return game.id;
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
    return  await this.quizGameRepository
      .createQueryBuilder('QuizGame')
      .where('QuizGame.status = :status', { status: 'PendingSecondPlayer' })
      .getOne();


  }


  async setFinishStatusToGame(gameId:string) {
    const game = await this.quizGameRepository.findOneBy({ id: gameId });
    game.status = 'Finished';
    game.finishGameDate = new Date()
    await this.quizGameRepository.save(game);
  }

  async connectToGameWhatPendingSecondPlayer(gameId: string, userId: number) {
    const game = await this.quizGameRepository.findOneBy({ id: gameId });
    game.secondPlayerId = userId;
    game.startGameDate = new Date();
    game.status = 'Active';
    await this.quizGameRepository.save(game);
  }

  async getCurrentUserGameIdByUserId(userId: number) {
    const game = await this.quizGameRepository
      .createQueryBuilder('QuizGame')
      .where('NOT QuizGame.status = :status', { status: 'finished' })
      .andWhere(
        'QuizGame.firstPlayerId = :userId OR QuizGame.secondPlayerId = :userId',
        { userId },
      )
      .getOne();
    return game?.id;
  }
}
// return await this.quizGameRepository
//   .createQueryBuilder('game')
//   .where('NOT game.status = :status', { status: 'finished' })
//   .andWhere(
//     'game.firstPlayerId = :userId OR game.secondPlayerId = :userId',
//     { userId },
//   )
//   .leftJoinAndSelect('game.questions', 'questions')
//   .orderBy('questions."questionNumber"', 'ASC')
//   .leftJoin('questions.question', 'question')
//   .addSelect(['question.id', 'question.body', 'question.correctAnswers'])
//   .getOne();
