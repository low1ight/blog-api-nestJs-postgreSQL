import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGamesRepo } from '../../repository/repository/quizGames.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { QuizGamesQuestionsRepo } from '../../repository/repository/quizGamesQuestions.repo';
import { QuizQuestionsRepo } from '../../../quiz_question/repository/repository/quiz.questions.repo';
import { QuizGamePlayerAnswersRepo } from '../../repository/repository/quizGamePlayerAnswers.repo';
import { AnswerQuestionDto } from '../../controllers/dto/AnswerQuestionDto';

export class AnswerQuestionUseCaseCommand {
  constructor(public userId: number, public dto: AnswerQuestionDto) {}
}

@CommandHandler(AnswerQuestionUseCaseCommand)
export class AnswerQuestionUseCase
  implements ICommandHandler<AnswerQuestionUseCaseCommand>
{
  constructor(
    private readonly quizGameRepo: QuizGamesRepo,
    private readonly quizGamesQuestionsRepo: QuizGamesQuestionsRepo,
    private readonly quizQuestionSaRepo: QuizQuestionsRepo,
    private readonly quizGamePlayerAnswersRepo: QuizGamePlayerAnswersRepo,
  ) {}

  async execute({ userId, dto }: AnswerQuestionUseCaseCommand) {
    //get current game id
    const userCurrentGameId =
      await this.quizGameRepo.getCurrentUserGameIdByUserId(userId);

    if (!userCurrentGameId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    // get count of answered questions by player for current game
    const currentlyAnsweredQuestionsByUser =
      await this.quizGamePlayerAnswersRepo.getPlayerAnswersInGameById(
        userId,
        userCurrentGameId,
      );

    if (currentlyAnsweredQuestionsByUser >= 5)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    //get questionId by question number and game id
    const question: { id: string; correctAnswers: string[] } =
      await this.quizGamesQuestionsRepo.getQuestionByGameIdAndQuestionNumber(
        userCurrentGameId,
        currentlyAnsweredQuestionsByUser + 1,
      );

    const answer = await this.quizGamePlayerAnswersRepo.addQuestionAnswer(
      userId,
      userCurrentGameId,
      question.id,
      dto,
      question.correctAnswers.includes(dto.answer),
    );

    return new CustomResponse(true, null, answer);
  }
}
