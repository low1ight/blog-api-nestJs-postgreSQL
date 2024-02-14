import { SetPublishQuizQuestionStatusDto } from '../../controllets/dto/SetPublishQuizQuestionStatusDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepo } from '../../repository/quiz.questions.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';

export class SetQuestionPublishStatusByIdUseCaseCommand {
  constructor(public dto: SetPublishQuizQuestionStatusDto, public id: string) {}
}

@CommandHandler(SetQuestionPublishStatusByIdUseCaseCommand)
export class SetQuestionPublishStatusByIdUseCase
  implements ICommandHandler<SetQuestionPublishStatusByIdUseCaseCommand>
{
  constructor(private readonly quizQuestionSaRepo: QuizQuestionsRepo) {}

  async execute({ dto, id }: SetQuestionPublishStatusByIdUseCaseCommand) {
    const quizQuestion = await this.quizQuestionSaRepo.getQuizQuestionById(id);

    if (!quizQuestion) return new CustomResponse(false, 1, 'not exist');

    if (quizQuestion.published === dto.published)
      return new CustomResponse(true);

    await this.quizQuestionSaRepo.setPublishQuestionStatus(dto, id);

    return new CustomResponse(true);
  }
}
