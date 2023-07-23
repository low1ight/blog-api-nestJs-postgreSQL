import { Injectable } from '@nestjs/common';
import { BlogPaginator } from '../../controllers/dto/query/BlogPaginator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogDbModeForSa } from '../dto/BlogDbModeForSa';
import { BlogSaViewModel } from '../dto/BlogSaViewModel';
import { BlogDbModel } from '../dto/BlogDbModel';
import { BlogViewModel } from '../dto/BlogViewModel';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getAllBlogs(userId: number | null, paginator: BlogPaginator) {
    const nameSearchTerm = `%${paginator.getSearchNameTerm()}%`;
    console.log(nameSearchTerm);

    const blogs: BlogDbModel[] = await this.dataSource.query(
      `
    SELECT "id",  "name", "description", "websiteUrl", "isMembership", "createdAt"
    FROM public."Blogs"
    WHERE ("ownerId" = $1 OR $1 IS NULL) AND "name" ILIKE $2
    ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
      LIMIT ${paginator.getPageSize()}
      OFFSET ${paginator.getOffset()}
    
    `,
      [userId, nameSearchTerm],
    );

    const blogViewModel = blogs.map((blog) => new BlogViewModel(blog));

    const totalBlogsCount = await this.dataSource.query(
      `
    
    SELECT Count(*)
    FROM public."Blogs"
    WHERE ("ownerId" = $1 OR $1 IS NULL) AND "name" ILIKE $2
    
    `,
      [userId, nameSearchTerm],
    );

    return paginator.paginate(blogViewModel, Number(totalBlogsCount[0].count));
  }

  async getBlogsForSa(paginator: BlogPaginator) {
    const nameSearchTerm = `%${paginator.getSearchNameTerm()}%`;

    const blogs: BlogDbModeForSa[] = await this.dataSource.query(
      `
    
    SELECT 
    b."id", b."name", b."description", b."websiteUrl", 
    b."isMembership", b."createdAt",b."isBanned",b."banDate",
    
    u."id" as "userId", u."login" as "userLogin"
    
    FROM public."Blogs" b
   
    JOIN "Users" u ON u."id" = b."ownerId"
     WHERE "name" ILIKE $1
    ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
      LIMIT ${paginator.getPageSize()}
      OFFSET ${paginator.getOffset()}
    
    
    `,
      [nameSearchTerm],
    );

    const blogsViewModel: BlogSaViewModel[] = blogs.map(
      (blog) => new BlogSaViewModel(blog),
    );

    const totalCount = await this.dataSource.query(
      `
    
     SELECT Count(*)

     FROM public."Blogs" b

     WHERE "name" ILIKE $1
    
    `,
      [nameSearchTerm],
    );

    return paginator.paginate(blogsViewModel, Number(totalCount[0].count));
  }

  async getBlogById(blogId: number) {
    const blog = await this.dataSource.query(
      `
    SELECT "id",  "name", "description", "websiteUrl", "isMembership", "createdAt"
    FROM public."Blogs"
    WHERE "id" = $1
    
    `,
      [blogId],
    );

    return blog[0] ? new BlogViewModel(blog[0]) : null;
  }
}
