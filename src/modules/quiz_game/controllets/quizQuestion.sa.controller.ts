import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateQuizQuestionInputDto } from './dto/CreateQuizQuestionInputDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuizQuestionUseCaseCommand } from '../application/use-cases/createQuizQuestionUseCase';
import { Param, ParseUUIDPipe } from '@nestjs/common';
import { DeleteQuizQuestionByIdUseCaseCommand } from '../application/use-cases/deleteQuizQuestionByIdUseCase';
import { CustomResponse } from '../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../utils/throwException';
import { SetPublishQuizQuestionStatusDto } from './dto/SetPublishQuizQuestionStatusDto';
import { SetQuestionPublishStatusByIdUseCaseCommand } from '../application/use-cases/setQuestionPublishStatusByIdUseCase';
import { UpdateQuizQuestionInputDto } from './dto/UpdateQuizQuestionInputDto';
import { UpdateQuizQuestionByIdUseCaseCommand } from '../application/use-cases/updateQuizQuestionByIdUseCase';
import { BasicAuthGuard } from '../../users_module/auth/guards/basic.auth.guard';
import { QuizQuestionQueryDto } from './dto/query/QuizQuestionQueryDto';
import { QuizQuestionQueryMapper } from './dto/query/QuizQuestionQueryMapper';
import { QuizQuestionQueryRepo } from '../repository/quiz.question.query.repo';

@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class QuizQuestionSaController {
  constructor(
    private readonly quizQuestionQueryRepo: QuizQuestionQueryRepo,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getQuestions(@Query() query: QuizQuestionQueryDto) {
    const mappedQuery = new QuizQuestionQueryMapper(query);

    return await this.quizQuestionQueryRepo.getQuizQuestions(mappedQuery);
  }

  @Post('')
  async createQuestion(@Body() dto: CreateQuizQuestionInputDto) {
    return await this.commandBus.execute(
      new CreateQuizQuestionUseCaseCommand(dto),
    );
  }

  @Put(':id/publish')
  @HttpCode(204)
  async setQuestionPublishStatusById(
    @Body() dto: SetPublishQuizQuestionStatusDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new SetQuestionPublishStatusByIdUseCaseCommand(dto, id),
    );

    if (!result.isSuccess)
      return Exceptions.throwHttpException(
        result.errStatusCode,
        result.content,
      );
  }

  @Put(':id')
  @HttpCode(204)
  async updateQuestionById(
    @Body() dto: UpdateQuizQuestionInputDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new UpdateQuizQuestionByIdUseCaseCommand(dto, id),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(
        result.errStatusCode,
        result.content,
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
