import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { PostsRepo } from '../../repository/posts.repo';

export class DeletePostUseCaseCommand {
  constructor(
    public postId: number,
    public blogId: number,
    public currentUserId: number,
  ) {}
}
@CommandHandler(DeletePostUseCaseCommand)
export class DeletePostForBlogUseCase
  implements ICommandHandler<DeletePostUseCaseCommand>
{
  constructor(private postsRepository: PostsRepo) {}

  async execute({ postId, blogId, currentUserId }: DeletePostUseCaseCommand) {
    const post = await this.postsRepository.getPostDataWithBlogOwnerId(postId);

    if (!post || post.blogId !== blogId)
      return new CustomResponse(false, CustomResponseEnum.notExist);

    if (post.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.postsRepository.deletePost(postId);

    return new CustomResponse(true);
  }
}
