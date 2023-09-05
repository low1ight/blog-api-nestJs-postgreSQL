import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../../users_module/users/repositories/repository/users.repo';
import { BlogsRepo } from '../repositories/repository/blogs.repo';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';

export class BindBlogUseCaseCommand {
  constructor(public blogId: number, public userId: number) {}
}
@CommandHandler(BindBlogUseCaseCommand)
export class BindBlogUseCase
  implements ICommandHandler<BindBlogUseCaseCommand>
{
  constructor(
    private readonly usersRepository: UsersRepo,
    public readonly blogsRepository: BlogsRepo,
  ) {}
  async execute({ blogId, userId }: BindBlogUseCaseCommand) {
    const blogOwnerId: number | null =
      await this.blogsRepository.getBlogOwnerId(blogId);

    if (blogOwnerId)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'user has already bound to blog',
      );

    const isUserExist = await this.usersRepository.isUserExist(userId);

    if (!isUserExist)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'user do not exist',
      );

    await this.blogsRepository.bindUserForBlog(blogId, userId);

    return new CustomResponse(true);
  }
}
