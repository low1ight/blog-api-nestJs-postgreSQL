import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogDto } from '../../controllers/dto/banUserForBlogDto';
import { BlogsRepository } from '../../repositories/repository/blogs.repository';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';
import { BannedUsersForBlogRepo } from '../../../../users_module/users/repositories/repository/bannedUsersForBlogs.repo';
import { UsersRepo } from '../../../../users_module/users/repositories/repository/users.repo';

export class BanUserForBlogUseCaseCommand {
  constructor(
    public dto: BanUserForBlogDto,
    public currentUserId: number,
    public userForBanId: number,
  ) {}
}
@CommandHandler(BanUserForBlogUseCaseCommand)
export class BanUserForBlogUseCase
  implements ICommandHandler<BanUserForBlogUseCaseCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepo,
    private blogsBannedUsersRepository: BannedUsersForBlogRepo,
  ) {}

  async execute({
    dto,
    currentUserId,
    userForBanId,
  }: BanUserForBlogUseCaseCommand) {
    if (currentUserId === userForBanId)
      return new CustomResponse(false, CustomResponseEnum.badRequest);

    const blogId = Number(dto.blogId);
    if (!blogId)
      return new CustomResponse(false, CustomResponseEnum.badRequest);

    const isUserAlreadyBannedForBlog =
      await this.blogsBannedUsersRepository.isUserBannedForBlog(
        userForBanId,
        blogId,
      );

    if (isUserAlreadyBannedForBlog === dto.isBanned)
      return new CustomResponse(true);

    if (!dto.isBanned) {
      await this.blogsBannedUsersRepository.removeBanedUserForBlog(
        userForBanId,
        blogId,
      );

      return new CustomResponse(true);
    }

    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) return new CustomResponse(false, CustomResponseEnum.badRequest);

    if (blog.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    const isUserExist = await this.usersRepository.isUserExist(userForBanId);

    if (!isUserExist)
      return new CustomResponse(false, CustomResponseEnum.notExist);

    await this.blogsBannedUsersRepository.banUserForBlog(
      blogId,
      userForBanId,
      dto.banReason,
    );

    return new CustomResponse(true);
  }
}
