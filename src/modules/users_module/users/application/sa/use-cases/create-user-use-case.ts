import { CreateUserDto } from '../../../controllers/sa/dto/CreateUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordHashAdapter } from '../../../../adapters/passwordHash.adapter';
import { UsersRepository } from '../../../repositories/users.repository';

export class CreateUserUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private passwordHashAdapter: PasswordHashAdapter,
  ) {}
  async execute(command: CreateUserUseCaseCommand) {
    //hashing user password
    const hashedPassword = await this.passwordHashAdapter.hashPassword(
      command.dto.password,
    );
    const userDtoWithHashedPassword: CreateUserDto = {
      ...command.dto,
      password: hashedPassword,
    };

    return await this.usersRepository.createUser(userDtoWithHashedPassword);
  }
}
