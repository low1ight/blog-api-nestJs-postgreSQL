import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../controllers/dto/CreateBlogDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogViewModel } from './dto/BlogViewModel';

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
    
        INSERT INTO public."Blog"(
         "ownerId", "name", "description", "websiteUrl", "isMembership", "createdAt")
        VALUES ( $1, $2, $3, $4, $5, now())
        RETURNING "id", "name", "description", "websiteUrl", "isMembership", "createdAt"
    
        `,
      [ownerId, name, description, websiteUrl, isMembership],
    );

    return result[0];
  }
}
