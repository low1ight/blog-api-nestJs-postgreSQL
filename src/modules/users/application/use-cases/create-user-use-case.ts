import { CreateUserDto } from '../../controllers/sa/dto/CreateUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersSaRepository } from '../../repositories/repository/sa/users.sa.repository';

export class CreateUserUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(private usersRepository: UsersSaRepository) {}
  async execute(command: CreateUserUseCaseCommand) {
    return await this.usersRepository.createUser(command.dto);
  }
}
