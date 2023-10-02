import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogInputDto } from './dto/CreateBlogInputDto';
import { JwtAuthGuard } from '../../../users_module/auth/guards/jwt.auth.guard';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CreateBlogUseCaseCommand } from '../application/use-cases/createBlogUseCase';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { UpdateBlogUseCaseCommand } from '../application/use-cases/updateBlogUseCase';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../../utils/throwException';
import { DeleteBlogUseCaseCommand } from '../application/use-cases/deleteBlogUseCase';
import { CreatePostForBlogDto } from './dto/createPostForBlogDto';
import { CreatePostForBlogUseCaseCommand } from '../../posts/application/use-cases/createPostForBlogUseCase';
import { PostsQueryRepository } from '../../posts/repository/posts-query-repository.service';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { UpdatePostUseCaseCommand } from '../../posts/application/use-cases/updatePostUseCase';
import { DeletePostUseCaseCommand } from '../../posts/application/use-cases/deletePostUseCase';
import { PostsQueryDto } from '../../posts/controllers/dto/query/PostsQueryDto';
import { PostQueryMapper } from '../../posts/controllers/dto/query/PostQueryMapper';
import { BlogQueryInputDto } from './dto/query/BlogQueryInputDto';
import { BlogQueryMapper } from './dto/query/BlogQueryMapper';
import { BlogsQueryRepo } from '../repositories/query-repository/blogs-query-repo';
import { CommentsQueryRepository } from '../../comments/repositories/query-repository/comments.query.repository';
import { CommentQueryMapper } from '../../comments/controllers/dto/query/CommentQueryMapper';
import { CommentInputQueryDto } from '../../comments/controllers/dto/query/CommentInputQueryType';
import { BasicAuthGuard } from '../../../users_module/auth/guards/basic.auth.guard';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsBloggerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepo,
  ) {}

  @Post('')
  async createBlog(
    @Body() dto: CreateBlogInputDto,
    // @CurrentUser() { id }: UserDataFromAT,
  ) {
    return await this.commandBus.execute(
      new CreateBlogUseCaseCommand(dto, null),
    );
  }

  @Put('/:id')
  @HttpCode(204)
  async updateBlog(
    @Body() dto: UpdateBlogDto,
    @Param('id', CustomParseInt) id: number,
    // @CurrentUser() userData: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new UpdateBlogUseCaseCommand(dto, null, id),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(result.errStatusCode);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlog(
    @Param('id', CustomParseInt) id: number,
    // @CurrentUser() userData: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new DeleteBlogUseCaseCommand(null, id),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(result.errStatusCode);
  }
  @Post(':id/posts')
  async createPost(
    @Param('id', CustomParseInt) id: number,
    @Body() dto: CreatePostForBlogDto,
    // @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<number | null> = await this.commandBus.execute(
      new CreatePostForBlogUseCaseCommand(id, null, dto),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return await this.postsQueryRepository.getPostById(result.content, null);
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async editBlog(
    @Param('blogId', CustomParseInt) blogId: number,
    @Param('postId', CustomParseInt) postId: number,
    @Body() dto: UpdatePostDto,
    // @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<number | null> = await this.commandBus.execute(
      new UpdatePostUseCaseCommand(postId, blogId, null, dto),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return;
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(
    @Param('blogId', CustomParseInt) blogId: number,
    @Param('postId', CustomParseInt) postId: number,
    // @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<number | null> = await this.commandBus.execute(
      new DeletePostUseCaseCommand(postId, blogId, null),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return;
  }
  @Get(':id/posts')
  async getBlogPosts(
    @Param('id', CustomParseInt) id: number,
    @Query() query: PostsQueryDto,
    // @CurrentUser() userData: UserDataFromAT,
  ) {
    const mappedQuery = new PostQueryMapper(query);

    return await this.postsQueryRepository.getPosts(id, mappedQuery, null);
  }

  @Get('')
  async getAllCurrentUserBlogs(
    @Query() dto: BlogQueryInputDto,
    // @CurrentUser() { id }: UserDataFromAT,
  ) {
    const mappedQuery = new BlogQueryMapper(dto);

    return await this.blogsQueryRepository.getAllUserBlogs(null, mappedQuery);
  }

  @Get('comments')
  async getAllCurrentUserBlogsComments(
    @Query() dto: CommentInputQueryDto,
    @CurrentUser() { id }: UserDataFromAT,
  ) {
    const mappedQuery = new CommentQueryMapper(dto);

    return await this.commentsQueryRepository.getAllUserBlogsComments(
      mappedQuery,
      id,
    );
  }
}
