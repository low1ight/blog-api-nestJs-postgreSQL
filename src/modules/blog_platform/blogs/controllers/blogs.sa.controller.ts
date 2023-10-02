import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { BasicAuthGuard } from '../../../users_module/auth/guards/basic.auth.guard';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogUseCaseCommand } from '../application/bindBlogUseCase';
import { Exceptions } from '../../../../utils/throwException';
import { BanBlogDto } from './dto/BanBlogDto';
import { BanBlogUseCaseCommand } from '../application/use-cases/banBlogUseCase';
import { BlogQueryInputDto } from './dto/query/BlogQueryInputDto';
import { BlogQueryMapper } from './dto/query/BlogQueryMapper';
import { BlogsQueryRepo } from '../repositories/query-repository/blogs-query-repo';

@Controller('saa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepo,
  ) {}
  @Put(':blogId/bind-with-user/:userId')
  async bingUserForBlog(
    @Param('blogId', CustomParseInt) blogId: number,
    @Param('userId', CustomParseInt) userId: number,
  ) {
    const result: CustomResponse<string | null> = await this.commandBus.execute(
      new BindBlogUseCaseCommand(blogId, userId),
    );

    if (!result.isSuccess)
      return Exceptions.throwHttpException(
        result.errStatusCode,
        result.content,
      );
  }

  @Put(':id/ban')
  @HttpCode(204)
  async banBlog(
    @Param('id', CustomParseInt) id: number,
    @Body() dto: BanBlogDto,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new BanBlogUseCaseCommand(id, dto),
    );
    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);
  }

  @Get()
  async getBlogs(@Query() query: BlogQueryInputDto) {
    const mappedQuery = new BlogQueryMapper(query);

    return this.blogsQueryRepository.getBlogsForSa(mappedQuery);
  }
}
