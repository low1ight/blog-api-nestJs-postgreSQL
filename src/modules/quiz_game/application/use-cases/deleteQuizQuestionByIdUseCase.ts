import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepo } from '../../repository/quiz.questions.repo';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';

export class DeleteQuizQuestionByIdUseCaseCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuizQuestionByIdUseCaseCommand)
export class DeleteQuizQuestionByIdUseCase
  implements ICommandHandler<DeleteQuizQuestionByIdUseCaseCommand>
{
  constructor(private readonly quizQuestionSaRepo: QuizQuestionsRepo) {}

  async execute({ id }: DeleteQuizQuestionByIdUseCaseCommand) {
    const quizQuestion = await this.quizQuestionSaRepo.getQuizQuestionById(id);

    if (!quizQuestion) return new CustomResponse(false, 1, 'not exist');

    await this.quizQuestionSaRepo.deleteQuizQuestionById(id);

    return new CustomResponse(true);
  }
}
