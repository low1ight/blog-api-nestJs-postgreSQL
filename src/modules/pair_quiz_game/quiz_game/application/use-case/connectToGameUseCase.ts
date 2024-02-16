import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameRepo } from '../../quizGame.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';

export class ConnectToGameUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(ConnectToGameUseCaseCommand)
export class ConnectToGameUseCase
  implements ICommandHandler<ConnectToGameUseCaseCommand>
{
  constructor(private readonly quizGameRepo: QuizGameRepo) {}

  async execute({ userId }: ConnectToGameUseCaseCommand) {
    //check is user has already an active game or lobby
    const isUserHaveActiveGame =
      await this.quizGameRepo.isUserHaveNotFinishedGame(userId);

    if (isUserHaveActiveGame)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    //find game what pending a second Player
    //if it exists, connect to game or creating new game
    const gameId = await this.quizGameRepo.findGameWhatPendingSecondPlayer();

    if (gameId) {
      await this.quizGameRepo.connectToGameWhatPendingSecondPlayer(
        gameId,
        userId,
      );
    } else {
      await this.quizGameRepo.createNewQuizGame(userId);
    }

    return new CustomResponse(true);
  }
}
