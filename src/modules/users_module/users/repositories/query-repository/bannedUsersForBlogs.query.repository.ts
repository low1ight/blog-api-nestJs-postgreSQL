import { Injectable } from '@nestjs/common';
import { BannedUsersPaginator } from '../../controllers/dto/query/bannedUsers/BannedUsersPaginator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BannedUserBloggerDbModel,
  BannedUsersBloggerViewModel,
} from './dto/BannedUsersBloggerViewModel';

@Injectable()
export class BannedUsersForBlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getAllBannedUsersForBlog(
    blogId: number,
    paginator: BannedUsersPaginator,
  ) {
    const loginTerm = `%${paginator.searchLoginTerm}%`;

    const users: BannedUserBloggerDbModel[] = await this.dataSource.query(
      `
    
    
    SELECT  b."banReason","banDate",u."id","login"

    FROM public."BannedUsersForBlogs" b
    JOIN "Users" u ON u."id" = b."userId" 
    WHERE b."blogId" = $1 AND u."login" ILIKE $2
    ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
    LIMIT ${paginator.getPageSize()}
    OFFSET ${paginator.getOffset()}
    
    
    `,
      [blogId, loginTerm],
    );

    const totalCount = await this.dataSource.query(
      `
    
     SELECT Count(*)

    FROM public."BannedUsersForBlogs" b
    JOIN "Users" u ON u."id" = b."userId" 
    WHERE b."blogId" = $1 AND u."login" ILIKE $2
    `,
      [blogId, loginTerm],
    );

    const bannedUsersViewModels: BannedUsersBloggerViewModel[] = users.map(
      (user) => new BannedUsersBloggerViewModel(user),
    );

    return paginator.paginate(
      bannedUsersViewModels,
      Number(totalCount[0].count),
    );
  }
}
