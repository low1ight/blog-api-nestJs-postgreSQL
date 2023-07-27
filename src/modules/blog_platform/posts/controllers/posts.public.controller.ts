import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryDto } from './dto/query/PostsQueryDto';
import { PostsPaginator } from './dto/query/PostsPaginator';
import { PostsQueryRepository } from '../repository/posts-query-repository.service';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { PostViewModel } from '../repository/dto/postViewModel';
import { Exceptions } from '../../../../utils/throwException';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { JwtAuthGuard } from '../../../users_module/auth/guards/jwt.auth.guard';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CreateCommentInputDto } from '../../comments/controllers/dto/CreateCommentInputDto';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentForPostUseCaseCommand } from '../../comments/application/use-cases/createCommentForPostUseCase';
import { SetLikeStatusForPostDto } from './dto/SetLikeStatusForPostDto';
import { CommentsQueryRepository } from '../../comments/repositories/query-repository/comments.query.repository';
import { SetLikeStatusForPostUseCaseCommand } from '../application/use-cases/setLikeStatusForPostUseCase';
import { OptionalJwtAuthGuard } from '../../../users_module/auth/guards/optional.jwt.guard';

@Controller('posts')
export class PostsPublicController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}
  @Get('')
  @UseGuards(OptionalJwtAuthGuard)
  async getAllPosts(
    @Query() query: PostsQueryDto,
    @CurrentUser() user: UserDataFromAT | null,
  ) {
    const paginator = new PostsPaginator(query);

    return await this.postsQueryRepository.getPosts(
      null,
      paginator,
      user?.id || null,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostById(
    @Param('id', CustomParseInt) id: number,
    @CurrentUser() user: UserDataFromAT | null,
  ) {
    const post: PostViewModel | null =
      await this.postsQueryRepository.getPostById(id, user?.id || null);
    if (!post) Exceptions.throwHttpException(CustomResponseEnum.notExist);
    return post;
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentForPost(
    @Param('id', CustomParseInt) id: number,
    @Body() dto: CreateCommentInputDto,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<string | null | number> =
      await this.commandBus.execute(
        new CreateCommentForPostUseCaseCommand(dto, user.id, id),
      );

    if (!result.isSuccess)
      Exceptions.throwHttpException(result.errStatusCode, result.content);

    return await this.commentsQueryRepository.getCommentById(
      result.content as number,
    );
  }

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  async setLikeStatusForPost(
    @Param('postId', CustomParseInt) id: number,
    @Body() dto: SetLikeStatusForPostDto,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new SetLikeStatusForPostUseCaseCommand(dto, user.id, id),
    );
    if (!result.isSuccess)
      Exceptions.throwHttpException(result.errStatusCode, result.content);
  }
}
