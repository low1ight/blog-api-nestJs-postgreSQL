import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsQueryDto } from './dto/query/PostsQueryDto';
import { PostsPaginator } from './dto/query/PostsPaginator';
import { PostsQueryRepository } from '../repository/posts-query-repository.service';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { PostViewModel } from '../repository/dto/postViewModel';
import { Exceptions } from '../../../../utils/throwException';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';

@Controller('posts')
export class PostsPublicController {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}
  @Get('')
  async getAllPosts(@Query() query: PostsQueryDto) {
    const paginator = new PostsPaginator(query);

    return await this.postsQueryRepository.getPosts(null, paginator);
  }

  @Get(':id')
  async getPostById(@Param('id', CustomParseInt) id: number) {
    const post: PostViewModel | null =
      await this.postsQueryRepository.getPostById(id);
    if (!post) Exceptions.throwHttpException(CustomResponseEnum.notExist);
    return post;
  }
}
