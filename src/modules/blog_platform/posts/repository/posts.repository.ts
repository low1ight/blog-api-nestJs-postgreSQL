import { Injectable } from '@nestjs/common';
import { CreatePostForBlogDto } from '../../blogs/controllers/dto/createPostForBlogDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdatePostDto } from '../../blogs/controllers/dto/UpdatePostDto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPost(
    blogId: number,
    { title, shortDescription, content }: CreatePostForBlogDto,
  ) {
    const result = await this.dataSource.query(
      `
    
    
        INSERT INTO public."Posts"(
         "blogId", title, "shortDescription", content, "createdAt")
        VALUES ( $1, $2, $3, $4, now())
        RETURNING "id";
    
    
    
    
    
    `,

      [blogId, title, shortDescription, content],
    );

    return result[0].id;
  }

  async updatePost(
    postId: number,
    { title, content, shortDescription }: UpdatePostDto,
  ) {
    return await this.dataSource.query(
      `

    UPDATE public."Posts"
    SET  title=$2, "shortDescription"=$4, content=$3
    WHERE "id" = $1;
    `,
      [postId, title, content, shortDescription],
    );
  }

  async deletePost(postId: number) {
    return await this.dataSource.query(
      `
    DELETE FROM "Posts" 
    WHERE "id" = $1
    
    `,
      [postId],
    );
  }

  async getPostDataWithBlogOwnerId(postId: number) {
    const result = await this.dataSource.query(
      `
    SELECT *,
    (SELECT "ownerId" FROM "Blogs" WHERE "id" = p."blogId")
    FROM "Posts" p
    WHERE "id" = $1
    
    `,
      [postId],
    );

    return result[0] ? result[0] : null;
  }

  async getPostBlogId(postId: number): Promise<number | null> {
    const result = await this.dataSource.query(
      `
    
    SELECT "blogId" 
    FROM "Posts"
    WHERE "id" = $1
  
    
    
    `,
      [postId],
    );

    return result[0]?.blogId || null;
  }
}
