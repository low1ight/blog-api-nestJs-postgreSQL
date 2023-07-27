import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetLikeStatusForCommentDto } from '../../controllers/dto/SetLikeStatusForCommentDto';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { CommentsRepository } from '../../repositories/repository/comments.repository';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { CommentLikeDbModel } from '../../../posts/repository/dto/CommentLikeDbModel';
import { CommentLikesRepository } from '../../repositories/repository/commentLikes.repository';

export class SetLikeStatusForCommentUseCaseCommand {
  constructor(
    public dto: SetLikeStatusForCommentDto,
    public commentId: number,
    public userId: number,
  ) {}
}

@CommandHandler(SetLikeStatusForCommentUseCaseCommand)
export class SerLikeStatusForCommentUseCase
  implements ICommandHandler<SetLikeStatusForCommentUseCaseCommand>
{
  constructor(
    private readonly blogsService: BlogsService,
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsLikesRepository: CommentLikesRepository,
  ) {}
  async execute({
    dto,
    commentId,
    userId,
  }: SetLikeStatusForCommentUseCaseCommand) {
    const postId = await this.commentsRepository.getPostIdOfComment(commentId);
    if (!postId)
      return new CustomResponse(
        false,
        CustomResponseEnum.notExist,
        'cant set like for not-existed comment',
      );

    const validationResult =
      await this.blogsService.validateBanDataBeforeAction(postId, userId);

    if (!validationResult.isSuccess) return validationResult;

    const currentUserLikeForComment: CommentLikeDbModel | null =
      await this.commentsLikesRepository.getUserLikeForComment(
        userId,
        commentId,
      );

    //if current like status equal new like status return with successful result
    if (
      (!currentUserLikeForComment && dto.likeStatus === 'None') ||
      currentUserLikeForComment?.likeStatus === dto.likeStatus
    )
      return new CustomResponse(true);

    if (dto.likeStatus === 'None') {
      await this.commentsLikesRepository.deleteLikeForComment(
        commentId,
        userId,
      );
      return new CustomResponse(true);
    }

    if (!currentUserLikeForComment) {
      await this.commentsLikesRepository.createLikeForComment(
        commentId,
        userId,
        dto.likeStatus,
      );
      return new CustomResponse(true);
    }

    await this.commentsLikesRepository.updateLikeStatusForComment(
      commentId,
      userId,
      dto.likeStatus,
    );
    return new CustomResponse(true);
  }
}
