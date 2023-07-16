import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../../repository/blog.repository';
import { CreatePostForBlogDto } from '../../controllers/dto/createPostForBlogDto';
import { BlogDbModel } from '../../repository/dto/BlogDbModel';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { PostsRepository } from '../../../posts/repository/posts.repository';

export class CreatePostForBlogUseCaseCommand {
  constructor(
    public blogId: number,
    public currentUserId: number,
    public dto: CreatePostForBlogDto,
  ) {}
}
@CommandHandler(CreatePostForBlogUseCaseCommand)
export class CreatePostForBlogUseCase
  implements ICommandHandler<CreatePostForBlogUseCaseCommand>
{
  constructor(
    private blogRepository: BlogRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    blogId,
    dto,
    currentUserId,
  }: CreatePostForBlogUseCaseCommand) {
    const blog: null | BlogDbModel = await this.blogRepository.getBlogById(
      blogId,
    );

    if (!blog) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blog.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    const postId = await this.postsRepository.createPost(blogId, dto);

    return new CustomResponse(true, null, postId);
  }
}
