import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { QuizQuestionsSaRepo } from '../repository/quiz.questions.sa.repo';
import { CreateQuizQuestionInputDto } from './dto/CreateQuizQuestionInputDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuizQuestionUseCaseCommand } from '../application/use-cases/createQuizQuestionUseCase';
import { Param, ParseUUIDPipe } from '@nestjs/common';
import { DeleteQuizQuestionByIdUseCaseCommand } from '../application/use-cases/deleteQuizQuestionByIdUseCase';
import { CustomResponse } from '../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../utils/throwException';

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

  @Delete(':id')
  @HttpCode(204)
  async deleteQuestionById(@Param('id', new ParseUUIDPipe()) id: string) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new DeleteQuizQuestionByIdUseCaseCommand(id),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(
        result.errStatusCode,
        result.content,
      );
  }
}
