import { BlogsQueryRepo } from '../repositories/query-repository/blogs-query-repo';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BlogQueryInputDto } from './dto/query/BlogQueryInputDto';
import { BlogQueryMapper } from './dto/query/BlogQueryMapper';
import { PostQueryMapper } from '../../posts/controllers/dto/query/PostQueryMapper';
import { PostsQueryDto } from '../../posts/controllers/dto/query/PostsQueryDto';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { PostsQueryRepository } from '../../posts/repository/posts-query-repository.service';
import { BlogViewModel } from '../repositories/dto/BlogViewModel';
import { Exceptions } from '../../../../utils/throwException';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { OptionalJwtAuthGuard } from '../../../users_module/auth/guards/optional.jwt.guard';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
@Controller('blogs')
export class BlogsPublicController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepo,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  @Get('')
  async getBlogs(@Query() query: BlogQueryInputDto) {
    const mappedQuery = new BlogQueryMapper(query);

    return await this.blogsQueryRepository.getAllBLogForPublic(mappedQuery);
  }

  @Get(':id/posts')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostsForBlogs(
    @Query() query: PostsQueryDto,
    @Param('id', CustomParseInt) id: number,
    @CurrentUser() userData: UserDataFromAT,
  ) {
    const mappedQuery = new PostQueryMapper(query);

    return await this.postsQueryRepository.getPosts(
      id,
      mappedQuery,
      userData?.id || null,
    );
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
