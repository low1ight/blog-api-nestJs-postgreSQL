import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
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

@Controller('blogger')
export class BlogsBloggerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('blogs')
  @UseGuards(JwtAuthGuard)
  async createBlog(
    @Body() dto: CreateBlogInputDto,
    @CurrentUser() { id }: UserDataFromAT,
  ) {
    return await this.commandBus.execute(new CreateBlogUseCaseCommand(dto, id));
  }

  @Put('blogs/:id')
  @UseGuards(JwtAuthGuard)
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

  @Delete('blogs/:id')
  @UseGuards(JwtAuthGuard)
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
}
