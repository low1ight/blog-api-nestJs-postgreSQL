import { Injectable } from '@nestjs/common';
import { BannedUsersQueryMapper } from '../../controllers/dto/query/bannedUsers/BannedUsersQueryMapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BannedUserBloggerDbModel,
  BannedUsersBloggerViewModel,
} from './dto/BannedUsersBloggerViewModel';
import { Paginator } from '../../../../../utils/paginatorHelpers/Paginator';

@Injectable()
export class BannedUsersForBlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getAllBannedUsersForBlog(
    blogId: number,
    mappedQuery: BannedUsersQueryMapper,
  ) {
    const loginTerm = `%${mappedQuery.searchLoginTerm}%`;

    const users: BannedUserBloggerDbModel[] = await this.dataSource.query(
      `
    
    
    SELECT  b."banReason","banDate",u."id","login"

    FROM public."BannedUsersForBlogs" b
    JOIN "Users" u ON u."id" = b."userId" 
    WHERE b."blogId" = $1 AND u."login" ILIKE $2
    ORDER BY "${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()}
    LIMIT ${mappedQuery.getPageSize()}
    OFFSET ${mappedQuery.getOffset()}
    
    
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

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(
      bannedUsersViewModels,
      Number(totalCount[0].count),
    );
  }
}
