import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepo } from '../../repository/quiz.questions.repo';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { UpdateQuizQuestionInputDto } from '../../controllets/dto/UpdateQuizQuestionInputDto';

export class UpdateQuizQuestionByIdUseCaseCommand {
  constructor(public dto: UpdateQuizQuestionInputDto, public id: string) {}
}

@CommandHandler(UpdateQuizQuestionByIdUseCaseCommand)
export class UpdateQuizQuestionByIdUseCase
  implements ICommandHandler<UpdateQuizQuestionByIdUseCaseCommand>
{
  constructor(private readonly quizQuestionSaRepo: QuizQuestionsRepo) {}

  async execute({ dto, id }: UpdateQuizQuestionByIdUseCaseCommand) {
    const quizQuestion = await this.quizQuestionSaRepo.getQuizQuestionById(id);

    if (!quizQuestion) return new CustomResponse(false, 1, 'not exist');

    await this.quizQuestionSaRepo.updatePublishQuestionStatusById(dto, id);

    return new CustomResponse(true);
  }
}
