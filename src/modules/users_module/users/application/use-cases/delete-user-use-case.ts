import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/repository/users.repository';

export class DeleteUserUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteUserUseCaseCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserUseCaseCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: DeleteUserUseCaseCommand) {
    const isUserExist = await this.usersRepository.checkIsUserExistByField(
      'id',
      command.userId,
    );

    if (!isUserExist) return false;

    await this.usersRepository.deleteUserById(command.userId);

    return true;
  }
}
