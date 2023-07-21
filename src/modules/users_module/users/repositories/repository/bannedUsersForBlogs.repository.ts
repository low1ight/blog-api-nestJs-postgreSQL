import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BannedUsersForBlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async banUserForBlog(blogId: number, userId: number, banReason: string) {
    await this.dataSource.query(
      `
    
    INSERT INTO public."BannedUsersForBlogs"(
    "blogId", "userId", "banReason","banDate")
    VALUES ( $1, $2, $3, now());
     
    `,
      [blogId, userId, banReason],
    );
  }

  async removeBanedUserForBlog(userId: number, blogId: number) {
    await this.dataSource.query(
      `
    
    DELETE FROM public."BannedUsersForBlogs"
    WHERE "userId" = $1 AND "blogId" = $2
    
    `,
      [userId, blogId],
    );
  }

  async isUserBannedForBlog(userId: number, blogId: number) {
    const result = await this.dataSource.query(
      `
    
    SELECT Count(*)
    FROM public."BannedUsersForBlogs"
    WHERE "blogId" = $2 AND "userId" = $1
    
    
    `,
      [userId, blogId],
    );

    return result[0].count === '1';
  }
}
