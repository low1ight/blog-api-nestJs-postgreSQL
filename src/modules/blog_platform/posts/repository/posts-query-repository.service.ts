import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostDbModelWithBlogName } from './dto/PostDbModelWithBlogName';
import { PostViewModel } from './dto/postViewModel';
import { PostsPaginator } from '../controllers/dto/query/PostsPaginator';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPosts(blogId: number | null, paginator: PostsPaginator) {
    const posts = await this.dataSource.query(
      `
    
    SELECT id, "blogId", "title", "shortDescription", "content", "createdAt",
     (SELECT "name" AS "blogName" FROM "Blogs"  WHERE "id" = p."blogId"  )
     

      FROM public."Posts" p WHERE "blogId" = $1 OR $1 IS NULL
      ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
      LIMIT ${paginator.getPageSize()}
      OFFSET ${paginator.getOffset()}
    
    `,
      [blogId],
    );

    const totalCount = await this.dataSource.query(
      `
    SELECT Count(*)
     

      FROM public."Posts" p WHERE "blogId" = $1
    
    `,
      [blogId],
    );

    const postsViewModels: PostViewModel[] = posts.map(
      (post) => new PostViewModel(post),
    );

    return paginator.paginate(postsViewModels, Number(totalCount[0].count));
  }

  async getPostById(postId: number) {
    const post: PostDbModelWithBlogName = await this.dataSource.query(
      `
    
     SELECT p."id", p."blogId", p."title", p."shortDescription", p."content", p."createdAt",
       b."name" as "blogName"
       
     FROM public."Posts" p
     
     JOIN "Blogs" b ON b."id" = p."blogId"
     
     WHERE p."id" = $1 AND b."isBanned" = false
    
    
    `,
      [postId],
    );

    return post[0] ? new PostViewModel(post[0]) : null;
  }
}
