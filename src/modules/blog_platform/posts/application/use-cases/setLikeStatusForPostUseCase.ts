import { SetLikeStatusForPostDto } from '../../controllers/dto/SetLikeStatusForPostDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { PostsLikesRepo } from '../../repository/postsLikes.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { PostLikes } from '../../entity/PostLikes.entity';

export class SetLikeStatusForPostUseCaseCommand {
  constructor(
    public dto: SetLikeStatusForPostDto,
    public userId: number,
    public postId: number,
  ) {}
}

@CommandHandler(SetLikeStatusForPostUseCaseCommand)
export class SetLikeStatusForPostUseCase
  implements ICommandHandler<SetLikeStatusForPostUseCaseCommand>
{
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsLikesRepository: PostsLikesRepo,
  ) {}

  async execute({ dto, userId, postId }: SetLikeStatusForPostUseCaseCommand) {
    const validationResult =
      await this.blogsService.validateBanDataBeforeAction(postId, userId);

    if (!validationResult.isSuccess) return validationResult;

    const currentUserLikeForPost: PostLikes | null =
      await this.postsLikesRepository.getLike(postId, userId);

    //if current like status equal new like status return with successful result
    if (
      (!currentUserLikeForPost && dto.likeStatus === 'None') ||
      currentUserLikeForPost?.likeStatus === dto.likeStatus
    )
      return new CustomResponse(true);

    if (dto.likeStatus === 'None') {
      await this.postsLikesRepository.deleteLikeForPost(postId, userId);
      return new CustomResponse(true);
    }

    if (!currentUserLikeForPost) {
      await this.postsLikesRepository.createUserLikeForPost(
        dto,
        postId,
        userId,
      );
      return new CustomResponse(true);
    }

    await this.postsLikesRepository.updateLikeStatusById(postId, userId, dto);
    return new CustomResponse(true);
  }
}
