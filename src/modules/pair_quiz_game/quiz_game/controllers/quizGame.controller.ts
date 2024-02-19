import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../users_module/auth/guards/jwt.auth.guard';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectToGameUseCaseCommand } from '../application/use-case/connectToGameUseCase';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../../utils/throwException';
import { QuizGameQueryRepo } from '../repository/query-repository/quizGame.query.repo';
import { ConnectGameStatus } from '../types/ConnectGameStatus';

@Controller('/pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class QuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGameQueryRepo: QuizGameQueryRepo,
  ) {}
  @Post('/connection')
  async connectToGame(@CurrentUser() user: UserDataFromAT) {
    const result: CustomResponse<ConnectGameStatus | null> =
      await this.commandBus.execute(new ConnectToGameUseCaseCommand(user.id));
    if (!result.isSuccess)
      return Exceptions.throwHttpException(result.errStatusCode);

    if (result.content.status === 'created') {
      return await this.quizGameQueryRepo.getPendingForPlayerGame(
        result.content.gameId,
      );
    }
    return await this.quizGameQueryRepo.getStartedGame(result.content.gameId);
  }
}
