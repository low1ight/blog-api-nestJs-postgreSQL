import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../repositories/users.repository';
import { UsersSaRepository } from '../../../repositories/sa/repository/users.sa.repository';

export class DeleteUserUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteUserUseCaseCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserUseCaseCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersSaRepository: UsersSaRepository,
  ) {}
  async execute(command: DeleteUserUseCaseCommand) {
    const isUserExist = await this.usersRepository.checkIsUserExistByField(
      'id',
      command.userId,
    );

    if (!isUserExist) return false;

    const result = await this.usersSaRepository.deleteUserById(command.userId);

    console.log(result);
  }
}
