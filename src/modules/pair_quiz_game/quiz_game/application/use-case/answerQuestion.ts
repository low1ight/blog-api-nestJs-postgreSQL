import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AnswerQuestionDto } from '../../controllers/dto/AnswerQuestionDto';
import { QuizGamePlayerAnswerService } from '../quizGamePlayerAnswer.service';
import { QuizGameQuestionTimeOutService } from '../../adapters/quizGameQuestionTimeOut.service';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { QuizGamePlayerAnswerViewModel } from '../../repository/query-repository/dto/view_models/QuizGamePlayerAnswerViewModel';

export class AnswerQuestionUseCaseCommand {
  constructor(public userId: number, public dto: AnswerQuestionDto) {}
}

@CommandHandler(AnswerQuestionUseCaseCommand)
export class AnswerQuestionUseCase
  implements ICommandHandler<AnswerQuestionUseCaseCommand>
{
  constructor(
    private readonly quizGamePlayerAnswers: QuizGamePlayerAnswerService,
    private readonly quizGameQuestionTimeOutService: QuizGameQuestionTimeOutService,
  ) {}

  async execute({ userId, dto }: AnswerQuestionUseCaseCommand) {
    const result: CustomResponse<{
      answer: QuizGamePlayerAnswerViewModel;
      currentAnswerNumber: number;
    } | null> = await this.quizGamePlayerAnswers.answerQuestion(userId, dto);

    if (!result.isSuccess) return result;

    //after answer question we delete time out for this question and create new,
    // if there is available question for answer
    this.quizGameQuestionTimeOutService.stopTimeOut(userId);

    if (
      result.content.currentAnswerNumber <
      Number(process.env.QUIZ_GAME_QUESTION_COUNT)
    ) {
      console.log('get it');

      this.quizGameQuestionTimeOutService.setTimeOutForGame(
        userId,
        result.content.currentAnswerNumber + 1,
      );
    }

    return new CustomResponse(true, null, result.content.answer);
  }
}
