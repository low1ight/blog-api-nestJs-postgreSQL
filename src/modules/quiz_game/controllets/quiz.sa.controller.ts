import { Body, Controller, Post } from '@nestjs/common';
import { QuizQuestionsSaRepo } from '../repository/quiz.questions.sa.repo';
import { CreateQuizQuestionInputDto } from './dto/CreateQuizQuestionInputDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuizQuestionUseCaseCommand } from '../application/use-cases/createQuizQuestionUseCase';

@Controller('sa/quiz/questions')
export class QuizSaController {
  constructor(
    private readonly quizQuestionsSaRepo: QuizQuestionsSaRepo,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('')
  async createQuestion(@Body() dto: CreateQuizQuestionInputDto) {
    return await this.commandBus.execute(
      new CreateQuizQuestionUseCaseCommand(dto),
    );
  }
}
