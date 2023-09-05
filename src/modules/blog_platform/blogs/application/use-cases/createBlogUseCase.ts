import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../../repositories/repository/blogs.repo';
import { CreateBlogInputDto } from '../../controllers/dto/CreateBlogInputDto';
import { CreateBlogDto } from '../../controllers/dto/CreateBlogDto';
import { BlogViewModel } from '../../repositories/dto/BlogViewModel';

export class CreateBlogUseCaseCommand {
  constructor(public dto: CreateBlogInputDto, public userId: number) {}
}

@CommandHandler(CreateBlogUseCaseCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogUseCaseCommand>
{
  constructor(private blogRepository: BlogsRepo) {}

  async execute({
    dto,
    userId,
  }: CreateBlogUseCaseCommand): Promise<BlogViewModel> {
    const createBlogDto: CreateBlogDto = {
      ownerId: userId,
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
    };

    return await this.blogRepository.createBlog(createBlogDto);
  }
}
