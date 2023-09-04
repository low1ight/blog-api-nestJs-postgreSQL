import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BannedUsersForBlog } from '../../../../blog_platform/blogs/entity/BannedUsersForBlog.entity';

@Injectable()
export class BannedUsersForBlogRepo {
  constructor(
    @InjectRepository(BannedUsersForBlog)
    public bannedUsersForBlogRepository: Repository<BannedUsersForBlog>,
  ) {}

  async banUserForBlog(blogId: number, userId: number, banReason: string) {
    const bannedUserInfo = new BannedUsersForBlog();
    bannedUserInfo.blogId = blogId;
    bannedUserInfo.userId = userId;
    bannedUserInfo.banReason = banReason;
    bannedUserInfo.banDate = new Date();

    await this.bannedUsersForBlogRepository.save(bannedUserInfo);
  }

  async removeBanedUserForBlog(userId: number, blogId: number) {
    await this.bannedUsersForBlogRepository.delete({ userId, blogId });
  }

  async isUserBannedForBlog(userId: number, blogId: number) {
    const count = await this.bannedUsersForBlogRepository.count({
      where: { userId, blogId },
    });

    return count > 0;
  }
}
