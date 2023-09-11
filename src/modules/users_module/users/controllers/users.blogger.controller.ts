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
import { CommandBus } from '@nestjs/cqrs';
import { BanUserForBlogUseCaseCommand } from '../../../blog_platform/blogs/application/use-cases/banUserForBlogUseCase';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { BanUserForBlogDto } from '../../../blog_platform/blogs/controllers/dto/banUserForBlogDto';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../../utils/throwException';
import { BannedUsersInputQueryDto } from './dto/query/bannedUsers/BannedUsersInputQueryDto';
import { BannedUsersQueryMapper } from './dto/query/bannedUsers/BannedUsersQueryMapper';
import { BannedUsersForBlogsQueryRepository } from '../repositories/query-repository/bannedUsersForBlogs.query.repository';
import { BlogsQueryRepo } from '../../../blog_platform/blogs/repositories/query-repository/blogs-query-repo';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';

@Controller('blogger/users')
@UseGuards(JwtAuthGuard)
export class UsersBloggerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepo,
    private readonly bannedUsersForBlogsQueryRepository: BannedUsersForBlogsQueryRepository,
  ) {}
  @Put(':id/ban')
  @HttpCode(204)
  async banUserForBlog(
    @Param('id', CustomParseInt) id: number,
    @Body() dto: BanUserForBlogDto,
    @CurrentUser() userData: UserDataFromAT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new BanUserForBlogUseCaseCommand(dto, userData.id, id),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);
  }
  @Get('blog/:id')
  async getBannedUsersForBlog(
    @Param('id', CustomParseInt) id: number,
    @Query() query: BannedUsersInputQueryDto,
    @CurrentUser() user: UserDataFromAT,
  ) {
    const blogOwnerId: number | null =
      await this.blogsQueryRepository.getBlogOwnerId(id);

    if (!blogOwnerId)
      return Exceptions.throwHttpException(CustomResponseEnum.notExist);

    if (blogOwnerId !== user.id)
      return Exceptions.throwHttpException(CustomResponseEnum.forbidden);

    const paginator = new BannedUsersQueryMapper(query);

    return await this.bannedUsersForBlogsQueryRepository.getAllBannedUsersForBlog(
      id,
      paginator,
    );
  }
}
