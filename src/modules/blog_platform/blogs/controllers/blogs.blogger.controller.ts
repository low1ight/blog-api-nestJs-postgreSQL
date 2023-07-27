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
import { PostsPaginator } from '../../posts/controllers/dto/query/PostsPaginator';
import { BlogQueryInputDto } from './dto/query/BlogQueryInputDto';
import { BlogPaginator } from './dto/query/BlogPaginator';
import { BlogsQueryRepository } from '../repositories/query-repository/blogs-query-repository';

@Controller('blogger/blogs')
@UseGuards(JwtAuthGuard)
export class BlogsBloggerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Post('')
  async createBlog(
    @Body() dto: CreateBlogInputDto,
    @CurrentUser() { id }: UserDataFromAT,
  ) {
    return await this.commandBus.execute(new CreateBlogUseCaseCommand(dto, id));
  }

  @Put('/:id')
  @HttpCode(204)
  async updateBlog(
    @Body() dto: UpdateBlogDto,
    @Param('id', CustomParseInt) id: number,
    @CurrentUser() userData: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new UpdateBlogUseCaseCommand(dto, userData.id, id),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(result.errStatusCode);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlog(
    @Param('id', CustomParseInt) id: number,
    @CurrentUser() userData: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new DeleteBlogUseCaseCommand(userData.id, id),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(result.errStatusCode);
  }
  @Post(':id/posts')
  async createPost(
    @Param('id', CustomParseInt) id: number,
    @Body() dto: CreatePostForBlogDto,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<number | null> = await this.commandBus.execute(
      new CreatePostForBlogUseCaseCommand(id, user.id, dto),
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
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<number | null> = await this.commandBus.execute(
      new UpdatePostUseCaseCommand(postId, blogId, user.id, dto),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return;
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(
    @Param('blogId', CustomParseInt) blogId: number,
    @Param('postId', CustomParseInt) postId: number,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<number | null> = await this.commandBus.execute(
      new DeletePostUseCaseCommand(postId, blogId, user.id),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return;
  }
  @Get(':id/posts')
  async getBlogPosts(
    @Param('id', CustomParseInt) id: number,
    @Query() query: PostsQueryDto,
  ) {
    const paginator = new PostsPaginator(query);

    return await this.postsQueryRepository.getPosts(id, paginator);
  }

  @Get('')
  async getAllCurrentUserBlogs(
    @Query() dto: BlogQueryInputDto,
    @CurrentUser() { id }: UserDataFromAT,
  ) {
    const paginator = new BlogPaginator(dto);

    return await this.blogsQueryRepository.getAllUserBlogs(id, paginator);
  }
}
