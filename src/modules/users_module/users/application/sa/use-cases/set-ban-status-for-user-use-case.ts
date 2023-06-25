import { BanUserDto } from '../../../controllers/sa/dto/BanUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../repositories/users.repository';

export class SetBanStatusForUserUseCaseCommand {
  constructor(public userId: number, public dto: BanUserDto) {}
}

@CommandHandler(SetBanStatusForUserUseCaseCommand)
export class SetBanStatusForUserUseCase
  implements ICommandHandler<SetBanStatusForUserUseCaseCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: SetBanStatusForUserUseCaseCommand) {
    const isUserExist = await this.usersRepository.checkIsUserExistByField(
      'id',
      command.userId,
    );

    if (!isUserExist) return false;

    await this.usersRepository.setBanStatusForUser(command.userId, command.dto);

    return true;
  }
}
