import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../users_module/auth/guards/jwt.auth.guard';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { SetLikeStatusForCommentDto } from './dto/SetLikeStatusForCommentDto';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CommandBus } from '@nestjs/cqrs';
import { SetLikeStatusForCommentUseCaseCommand } from '../application/use-cases/serLikeStatusForCommentUseCase';
import { Exceptions } from '../../../../utils/throwException';

@Controller('comments')
export class CommentsPublicController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
