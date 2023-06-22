import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../../adapters/jwt.adapter';

export class LoginUseCaseCommand {
  constructor(public id, public login, public title, public ip) {}
}
@CommandHandler(LoginUseCaseCommand)
export class LoginUseCase implements ICommandHandler<LoginUseCaseCommand> {
  constructor(private readonly jwtAdapter: JwtAdapter) {}
  async execute({ id, login, title, ip }: LoginUseCaseCommand) {
    return await this.jwtAdapter.createJwtTokens(id, login, title, ip);
  }
}
