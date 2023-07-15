import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../../repository/blog.repository';
import { CreateBlogInputDto } from '../../controllers/dto/CreateBlogInputDto';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { BlogDbModel } from '../../repository/dto/BlogDbModel';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';

export class UpdateBlogUseCaseCommand {
  constructor(
    public dto: CreateBlogInputDto,
    public userId: number,
    public blogId: number,
  ) {}
}

@CommandHandler(UpdateBlogUseCaseCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogUseCaseCommand>
{
  constructor(private blogRepository: BlogRepository) {}

  async execute({
    dto,
    userId,
    blogId,
  }: UpdateBlogUseCaseCommand): Promise<CustomResponse<any>> {
    const blog: BlogDbModel | null = await this.blogRepository.getBlogById(
      blogId,
    );

    if (!blogId) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blog.ownerId !== userId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.blogRepository.updateBlog(blogId, dto);

    return new CustomResponse(true);
  }
}
