import { Injectable } from '@nestjs/common';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { BlogsRepo } from '../repositories/repository/blogs.repo';
import { PostsRepo } from '../../posts/repository/posts.repo';
import { UsersBanInfoRepo } from '../../../users_module/users/repositories/repository/usersBanInfo.repo';
import { BannedUsersForBlogRepo } from '../../../users_module/users/repositories/repository/bannedUsersForBlogs.repo';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepo,
    private readonly postsRepository: PostsRepo,
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
