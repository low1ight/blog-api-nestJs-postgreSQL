import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../../repositories/repository/blogs.repo';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { BlogDbModel } from '../../repositories/dto/BlogDbModel';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';

export class DeleteBlogUseCaseCommand {
  constructor(public userId: number, public blogId: number) {}
}

@CommandHandler(DeleteBlogUseCaseCommand)
export class DeleteBlogUseCase
  implements ICommandHandler<DeleteBlogUseCaseCommand>
{
  constructor(private blogRepository: BlogsRepo) {}

  async execute({
    userId,
    blogId,
  }: DeleteBlogUseCaseCommand): Promise<CustomResponse<any>> {
    const blog: BlogDbModel | null = await this.blogRepository.getBlogById(
      blogId,
    );

    if (!blogId) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blog.ownerId !== userId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.blogRepository.deleteBlogById(blogId);

    return new CustomResponse(true);
  }
}
