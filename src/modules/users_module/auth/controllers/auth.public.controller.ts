import { Controller, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUseCaseCommand } from '../application/public/useCase/login-use-case';

@Controller('auth')
export class AuthPublicController {
  constructor(private commandBus: CommandBus) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { id, login } = req.user;
    const title = req.headers['user-agent'];
    return await this.commandBus.execute(
      new LoginUseCaseCommand(id, login, title, ip),
    );
  }
}
