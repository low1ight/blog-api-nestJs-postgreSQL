import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepo } from '../../repositories/repository/comments.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';

export class DeleteCommentForPostUseCaseCommand {
  constructor(public userId: number, public commentId: number) {}
}

@CommandHandler(DeleteCommentForPostUseCaseCommand)
export class DeleteCommentForPostUseCase
  implements ICommandHandler<DeleteCommentForPostUseCaseCommand>
{
  constructor(private readonly commentsRepository: CommentsRepo) {}
  async execute({ userId, commentId }: DeleteCommentForPostUseCaseCommand) {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (comment.ownerId !== userId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.commentsRepository.deleteCommentById(commentId);

    return new CustomResponse(true);
  }
}
