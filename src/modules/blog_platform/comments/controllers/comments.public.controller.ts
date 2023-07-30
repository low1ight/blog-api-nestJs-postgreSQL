import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../users_module/auth/guards/jwt.auth.guard';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { SetLikeStatusForCommentDto } from './dto/SetLikeStatusForCommentDto';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CommandBus } from '@nestjs/cqrs';
import { SetLikeStatusForCommentUseCaseCommand } from '../application/use-cases/serLikeStatusForCommentUseCase';
import { Exceptions } from '../../../../utils/throwException';
import { OptionalJwtAuthGuard } from '../../../users_module/auth/guards/optional.jwt.guard';
import { CommentsQueryRepository } from '../repositories/query-repository/comments.query.repository';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { DeleteCommentForPostUseCaseCommand } from '../application/use-cases/deleteCommentForPostUseCase';

@Controller('comments')
export class CommentsPublicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Put(':commentId/like-status')
  @UseGuards(JwtAuthGuard)
  async setLikeForComment(
    @Param('commentId', CustomParseInt) id: number,
    @Body() dto: SetLikeStatusForCommentDto,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new SetLikeStatusForCommentUseCaseCommand(dto, id, user.id),
    );
    if (!result.isSuccess)
      Exceptions.throwHttpException(result.errStatusCode, result.content);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getCommentById(
    @Param('id', CustomParseInt) id: number,
    @CurrentUser() user: UserDataFromAT | null,
  ) {
    const result = await this.commentsQueryRepository.getCommentById(
      id,
      user?.id || null,
    );
    if (!result) Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCommentById(
    @Param('id', CustomParseInt) id: number,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new DeleteCommentForPostUseCaseCommand(user.id, id),
    );
    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);
  }
}
