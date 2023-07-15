import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../controllers/dto/CreateBlogDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogViewModel } from './dto/BlogViewModel';
import { UpdateBlogDto } from '../controllers/dto/UpdateBlogDto';

@Injectable()
export class BlogRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createBlog({
    ownerId,
    name,
    description,
    websiteUrl,
    isMembership,
  }: CreateBlogDto): Promise<BlogViewModel> {
    const result = await this.dataSource.query(
      `
    
        INSERT INTO public."Blogs"(
         "ownerId", "name", "description", "websiteUrl", "isMembership", "createdAt")
        VALUES ( $1, $2, $3, $4, $5, now())
        RETURNING "id", "name", "description", "websiteUrl", "isMembership", "createdAt"
    
        `,
      [ownerId, name, description, websiteUrl, isMembership],
    );

    return result[0];
  }

  async getBlogById(blogId) {
    const blog = await this.dataSource.query(
      `
    
    SELECT * FROM "Blogs"
    WHERE "id" = $1
    
    `,
      [blogId],
    );

    return blog[0] || null;
  }

  async updateBlog(
    blogId: number,
    { name, description, websiteUrl }: UpdateBlogDto,
  ) {
    return await this.dataSource.query(
      `

    UPDATE public."Blogs"
    SET name=$2, description=$3, "websiteUrl"=$4
    WHERE "id" = $1;
    
    
    `,
      [blogId, name, description, websiteUrl],
    );
  }
}
