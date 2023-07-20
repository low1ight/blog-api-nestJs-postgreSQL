import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/repository/blogs.repository';
import { CreatePostForBlogDto } from '../../../blogs/controllers/dto/createPostForBlogDto';
import { BlogDbModel } from '../../../blogs/repository/dto/BlogDbModel';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { PostsRepository } from '../../repository/posts.repository';

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
    private blogRepository: BlogsRepository,
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
