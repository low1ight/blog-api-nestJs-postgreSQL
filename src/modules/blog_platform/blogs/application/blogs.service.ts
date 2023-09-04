import { Injectable } from '@nestjs/common';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { BlogsRepository } from '../repositories/repository/blogs.repository';
import { PostsRepository } from '../../posts/repository/posts.repository';
import { UsersBanInfoRepo } from '../../../users_module/users/repositories/repository/usersBanInfo.repo';
import { BannedUsersForBlogRepo } from '../../../users_module/users/repositories/repository/bannedUsersForBlogs.repo';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersBanInfoRepository: UsersBanInfoRepo,
    private readonly bannedUsersForBlogsRepository: BannedUsersForBlogRepo,
  ) {}
  async validateBanDataBeforeAction(
    postId: number,
    ownerId: number,
  ): Promise<CustomResponse<any>> {
    const blogId: number | null = await this.postsRepository.getPostBlogId(
      postId,
    );

    if (!blogId)
      return new CustomResponse(
        false,
        CustomResponseEnum.notExist,
        'cant create comment for not-existed post',
      );

    const blog = await this.blogsRepository.getBlogBanStatusById(blogId);

    if (!blog)
      return new CustomResponse(
        false,
        CustomResponseEnum.notExist,
        'cant create comment for post of not-existed blog',
      );

    if (blog.isBanned)
      return new CustomResponse(
        false,
        CustomResponseEnum.forbidden,
        'cant create comment for post of banned blog',
      );

    const user = await this.usersBanInfoRepository.getUserBanStatusById(
      ownerId,
    );

    if (user && user?.isBanned)
      return new CustomResponse(
        false,
        CustomResponseEnum.forbidden,
        'banned user cant create comments',
      );

    const isCurrentUserBannedForBlog =
      await this.bannedUsersForBlogsRepository.isUserBannedForBlog(
        ownerId,
        blogId,
      );

    if (isCurrentUserBannedForBlog)
      return new CustomResponse(
        false,
        CustomResponseEnum.forbidden,
        'cant create comment for post of blog where you has been already banned',
      );

    return new CustomResponse(true);
  }
}
