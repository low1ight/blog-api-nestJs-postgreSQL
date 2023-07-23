import { BlogsQueryRepository } from '../repositories/query-repository/blogs-query-repository';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogQueryInputDto } from './dto/query/BlogQueryInputDto';
import { BlogPaginator } from './dto/query/BlogPaginator';
import { PostsPaginator } from '../../posts/controllers/dto/query/PostsPaginator';
import { PostsQueryDto } from '../../posts/controllers/dto/query/PostsQueryDto';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { PostsQueryRepository } from '../../posts/repository/posts-query-repository.service';
import { BlogViewModel } from '../repositories/dto/BlogViewModel';
import { Exceptions } from '../../../../utils/throwException';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
@Controller('blogs')
export class BlogsPublicController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  @Get('')
  async getBlogs(@Query() query: BlogQueryInputDto) {
    const paginator = new BlogPaginator(query);

    return await this.blogsQueryRepository.getAllBlogs(null, paginator);
  }

  @Get(':id/posts')
  async getPostsForBlogs(
    @Query() query: PostsQueryDto,
    @Param('id', CustomParseInt) id: number,
  ) {
    const paginator = new PostsPaginator(query);

    return await this.postsQueryRepository.getPosts(id, paginator);
  }

  @Get(':id')
  async getBlogById(@Param('id', CustomParseInt) id: number) {
    const blog: BlogViewModel | null =
      await this.blogsQueryRepository.getBlogById(id);
    if (!blog)
      return Exceptions.throwHttpException(CustomResponseEnum.notExist);
    return blog;
  }
}
