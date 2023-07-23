import { BlogsQueryRepository } from '../repositories/query-repository/blogs-query-repository';
import { Controller, Get, Query } from '@nestjs/common';
import { BlogQueryInputDto } from './dto/query/BlogQueryInputDto';
import { BlogPaginator } from './dto/query/BlogPaginator';
@Controller('blogs')
export class BlogsPublicController {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  @Get('')
  async getBlogs(@Query() query: BlogQueryInputDto) {
    const paginator = new BlogPaginator(query);

    return await this.blogsQueryRepository.getAllBlogs(null, paginator);
  }
}
