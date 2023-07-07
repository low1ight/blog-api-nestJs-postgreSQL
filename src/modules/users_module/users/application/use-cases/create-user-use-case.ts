import { CreateUserDto } from '../../controllers/dto/CreateUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';

export class CreateUserUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(private readonly usersService: UsersService) {}
  async execute(command: CreateUserUseCaseCommand) {
    return await this.usersService.createUser(command.dto, true);
  }
}
