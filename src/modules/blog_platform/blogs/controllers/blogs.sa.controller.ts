import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { BasicAuthGuard } from '../../../users_module/auth/guards/basic.auth.guard';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogUseCaseCommand } from '../application/bindBlogUseCase';
import { Exceptions } from '../../../../utils/throwException';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(private readonly commandBus: CommandBus) {}
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
}
