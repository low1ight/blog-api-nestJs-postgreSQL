import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostForBlogDto } from '../../../blogs/controllers/dto/createPostForBlogDto';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { PostsRepository } from '../../repository/posts.repository';

export class UpdatePostUseCaseCommand {
  constructor(
    public postId: number,
    public blogId: number,
    public currentUserId: number,
    public dto: CreatePostForBlogDto,
  ) {}
}
@CommandHandler(UpdatePostUseCaseCommand)
export class UpdatePostForBlogUseCase
  implements ICommandHandler<UpdatePostUseCaseCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    blogId,
    dto,
    currentUserId,
  }: UpdatePostUseCaseCommand) {
    const post = await this.postsRepository.getPostDataForUpdating(
      postId,
      blogId,
    );

    if (!post) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (post.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.postsRepository.updatePost(postId, dto);

    return new CustomResponse(true);
  }
}
