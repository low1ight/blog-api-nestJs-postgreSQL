import { CreateQuizQuestionInputDto } from '../../controllets/dto/CreateQuizQuestionInputDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepo } from '../../repository/repository/quiz.questions.repo';

export class CreateQuizQuestionUseCaseCommand {
  constructor(public dto: CreateQuizQuestionInputDto) {}
}

@CommandHandler(CreateQuizQuestionUseCaseCommand)
export class CreateQuizQuestionUseCase
  implements ICommandHandler<CreateQuizQuestionUseCaseCommand>
{
  constructor(private readonly quizQuestionSaRepo: QuizQuestionsRepo) {}

  async execute({ dto }: CreateQuizQuestionUseCaseCommand) {
    return await this.quizQuestionSaRepo.createQuizQuestion(dto);
  }
}
