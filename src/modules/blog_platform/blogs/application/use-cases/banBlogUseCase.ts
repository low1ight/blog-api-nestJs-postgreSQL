import { BanBlogDto } from '../../controllers/dto/BanBlogDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/repository/blogs.repository';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';

export class BanBlogUseCaseCommand {
  constructor(public blogId: number, public dto: BanBlogDto) {}
}
@CommandHandler(BanBlogUseCaseCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogUseCaseCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ blogId, dto }: BanBlogUseCaseCommand) {
    const blogBanStatus = await this.blogsRepository.getBlogBanStatusById(
      blogId,
    );
    if (!blogBanStatus)
      return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blogBanStatus.isBanned === dto.isBanned)
      return new CustomResponse(true);

    await this.blogsRepository.setBanStatusForBlog(dto.isBanned, blogId);

    return new CustomResponse(true);
  }
}
