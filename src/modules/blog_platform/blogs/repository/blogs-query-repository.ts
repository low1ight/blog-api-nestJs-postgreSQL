import { Injectable } from '@nestjs/common';
import { BlogPaginator } from '../controllers/dto/query/BlogPaginator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getUserBlogs(userId: number, paginator: BlogPaginator) {
    const nameSearchTerm = `%${paginator.getSearchNameTerm()}%`;

    const blogs = await this.dataSource.query(
      `
    SELECT "id",  "name", "description", "websiteUrl", "isMembership", "createdAt"
    FROM public."Blogs"
    WHERE "ownerId" = $1 AND "name" ILIKE $2
    ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
      LIMIT ${paginator.getPageSize()}
      OFFSET ${paginator.getOffset()}
    
    `,
      [userId, nameSearchTerm],
    );

    const totalBlogsCount = await this.dataSource.query(
      `
    
    SELECT Count(*)
    FROM public."Blogs"
    WHERE 'ownerId' = $1 AND "name" ILIKE $2
    
    `,
      [userId, nameSearchTerm],
    );

    return paginator.paginate(blogs, Number(totalBlogsCount[0].count));
  }
}
