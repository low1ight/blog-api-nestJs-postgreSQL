import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../repositories/repository/users.repo';

export class DeleteUserUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteUserUseCaseCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserUseCaseCommand>
{
  constructor(private readonly usersRepository: UsersRepo) {}
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
