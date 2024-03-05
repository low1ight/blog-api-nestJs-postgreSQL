import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGamesRepo } from '../../repository/repository/quizGames.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { QuizGamesQuestionsRepo } from '../../repository/repository/quizGamesQuestions.repo';
import { QuizQuestionsRepo } from '../../../quiz_question/repository/repository/quiz.questions.repo';
import { QuizGameQuestionTimeOutService } from '../../adapters/quizGameQuestionTimeOut.service';

export class ConnectToGameUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(ConnectToGameUseCaseCommand)
export class ConnectToGameUseCase
  implements ICommandHandler<ConnectToGameUseCaseCommand>
{
  constructor(
    private readonly quizGameRepo: QuizGamesRepo,
    private readonly quizGamesQuestionsRepo: QuizGamesQuestionsRepo,
    private readonly quizQuestionSaRepo: QuizQuestionsRepo,
    private readonly quizGameQuestionTimeOutService: QuizGameQuestionTimeOutService,
  ) {}

  async execute({ userId }: ConnectToGameUseCaseCommand) {
    //check is user has already an active game or lobby
    const isUserHaveActiveGame =
      await this.quizGameRepo.isUserHaveNotFinishedGame(userId);

    if (isUserHaveActiveGame)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    //find game what pending a second Player
    //if it exists, connect to game or creating new game
    const foundGame = await this.quizGameRepo.findGameWhatPendingSecondPlayer();

    //if already created game with pending second player founded, connect current user to it
    // set "active" status to game and return 'connected'

    if (foundGame?.id) {
      await this.quizGameRepo.connectToGameWhatPendingSecondPlayer(
        foundGame.id,
        userId,
      );

      this.quizGameQuestionTimeOutService.setTimeOutForGame(
        foundGame.firstPlayerId,
      );
      this.quizGameQuestionTimeOutService.setTimeOutForGame(userId);

      return new CustomResponse(true, null, {
        gameId: foundGame.id,
        status: 'connected',
      });
    }

    //get 5 random questions of, it returns null if it'll be fewer questions than necessary
    const questionsIdArr: string[] | null =
      await this.quizQuestionSaRepo.getRandomQuestionsId(
        Number(process.env.QUIZ_GAME_QUESTION_COUNT),
      );

    if (!questionsIdArr)
      return new CustomResponse(
        false,
        1,
        'not enough questions to create new game',
      );

    //create game and add random questions to this game
    const gameId: string = await this.quizGameRepo.createNewQuizGame(userId);
    await this.quizGamesQuestionsRepo.addQuestionForQuizGame(
      questionsIdArr,
      gameId,
    );
    return new CustomResponse(true, null, { gameId, status: 'created' });
  }
}
