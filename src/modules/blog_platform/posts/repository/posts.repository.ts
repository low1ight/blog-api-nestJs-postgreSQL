import { Injectable } from '@nestjs/common';
import { CreatePostForBlogDto } from '../../blogs/controllers/dto/createPostForBlogDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
}
