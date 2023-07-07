import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../../../users/controllers/dto/CreateUserDto';
import { UsersService } from '../../../../../users/application/users.service';

export class RegisterNewUserUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}
@CommandHandler(RegisterNewUserUseCaseCommand)
export class RegisterNewUserUseCase
  implements ICommandHandler<RegisterNewUserUseCaseCommand>
{
  constructor(private readonly usersService: UsersService) {}

  async execute({ dto }: RegisterNewUserUseCaseCommand) {
    await this.usersService.createUser(dto, false);
  }
}
