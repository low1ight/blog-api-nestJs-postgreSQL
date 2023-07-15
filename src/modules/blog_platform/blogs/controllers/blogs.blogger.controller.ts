import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogInputDto } from './dto/CreateBlogInputDto';
import { JwtAuthGuard } from '../../../users_module/auth/guards/jwt.auth.guard';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { CreateBlogUseCaseCommand } from '../application/use-cases/createBlogUseCase';

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
}
