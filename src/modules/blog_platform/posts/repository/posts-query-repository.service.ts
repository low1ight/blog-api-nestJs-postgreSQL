import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostDbModelWithBlogName } from './dto/PostDbModelWithBlogName';
import { PostViewModel } from './dto/postViewModel';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPostById(postId: number) {
    const post: PostDbModelWithBlogName = await this.dataSource.query(
      `
    
     SELECT id, "blogId", "title", "shortDescription", "content", "createdAt",
     (SELECT "name" AS "blogName" FROM "Blogs"  WHERE "id" = p."blogId"  )

      FROM public."Posts" p WHERE "id" = $1;
    
    
    `,
      [postId],
    );

    return post[0] ? new PostViewModel(post[0]) : null;
  }
}
