import { Injectable } from '@nestjs/common';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { QuizGamePlayerAnswersRepo } from '../repository/repository/quizGamePlayerAnswers.repo';
import { QuizGamesRepo } from '../repository/repository/quizGames.repo';
import { QuizGamesQuestionsRepo } from '../repository/repository/quizGamesQuestions.repo';
import { AnswerQuestionDto } from '../controllers/dto/AnswerQuestionDto';
import { QuizGamePlayerAnswerViewModel } from '../repository/query-repository/dto/view_models/QuizGamePlayerAnswerViewModel';

@Injectable()
export class QuizGamePlayerAnswerService {
  constructor(
    private readonly quizGamePlayerAnswersRepo: QuizGamePlayerAnswersRepo,
    private readonly quizGameRepo: QuizGamesRepo,
    private readonly quizGamesQuestionsRepo: QuizGamesQuestionsRepo,
  ) {}
  async answerQuestion(
    userId: number,
    dto: AnswerQuestionDto,
  ): Promise<
    CustomResponse<{
      answer: QuizGamePlayerAnswerViewModel;
      currentAnswerNumber: number;
    } | null>
  > {
    //get current game id
    const userCurrentGameId =
      await this.quizGameRepo.getCurrentUserGameIdByUserId(userId);

    if (!userCurrentGameId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    // get all player answers for current game
    const currentlyAnsweredQuestionsByUser =
      await this.quizGamePlayerAnswersRepo.getPlayerAnswersInGameByGameId(
        userId,
        userCurrentGameId,
      );


    if (
      currentlyAnsweredQuestionsByUser >=
      Number(process.env.QUIZ_GAME_QUESTION_COUNT)
    )
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    const currentAnswerNumber = currentlyAnsweredQuestionsByUser + 1;

    //get questionId by question number and game id
    const question: { id: string; correctAnswers: string[] } =
      await this.quizGamesQuestionsRepo.getQuestionByGameIdAndQuestionNumber(
        userCurrentGameId,
        currentAnswerNumber,
      );

    const answer: QuizGamePlayerAnswerViewModel =
      await this.quizGamePlayerAnswersRepo.addQuestionAnswer(
        userId,
        userCurrentGameId,
        question.id,
        dto,
        question.correctAnswers.includes(dto.answer),
      );


    const totalGameAnswers = await this.quizGamePlayerAnswersRepo.getTotalPlayersAnswersInGameByGameId(userCurrentGameId)

    //if answered question was last in the game, change game status to finished
    console.log(totalGameAnswers === Number(process.env.QUIZ_GAME_QUESTION_COUNT) * 2)
    console.log(totalGameAnswers)
    console.log(Number(process.env.QUIZ_GAME_QUESTION_COUNT) * 2)
    if(totalGameAnswers === Number(process.env.QUIZ_GAME_QUESTION_COUNT) * 2) {
      console.log('qwe')
      await this.quizGameRepo.setFinishStatusToGame(userCurrentGameId)
    }

    return new CustomResponse(true, null, { answer, currentAnswerNumber });
  }
}
