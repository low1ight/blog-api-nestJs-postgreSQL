import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../../../blogs/repositories/repository/blogs.repo';
import { CreatePostForBlogDto } from '../../../blogs/controllers/dto/createPostForBlogDto';
import { BlogDbModel } from '../../../blogs/repositories/dto/BlogDbModel';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { PostsRepo } from '../../repository/posts.repo';

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
    private blogRepository: BlogsRepo,
    private postsRepository: PostsRepo,
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

    // if (blog.ownerId !== currentUserId)
    //   return new CustomResponse(false, CustomResponseEnum.forbidden);

    const postId = await this.postsRepository.createPost(blogId, dto);

    return new CustomResponse(true, null, postId);
  }
}
