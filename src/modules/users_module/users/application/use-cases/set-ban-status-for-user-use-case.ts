import { BanUserDto } from '../../controllers/dto/BanUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../repositories/repository/users.repo';
import { UsersBanInfoRepo } from '../../repositories/repository/usersBanInfo.repo';

export class SetBanStatusForUserUseCaseCommand {
  constructor(public userId: number, public dto: BanUserDto) {}
}

@CommandHandler(SetBanStatusForUserUseCaseCommand)
export class SetBanStatusForUserUseCase
  implements ICommandHandler<SetBanStatusForUserUseCaseCommand>
{
  constructor(
    private readonly usersRepository: UsersRepo,
    private readonly usersBanInfoRepository: UsersBanInfoRepo,
  ) {}
  async execute({ userId, dto }: SetBanStatusForUserUseCaseCommand) {
    const isUserExist = await this.usersRepository.checkIsUserExistByField(
      'id',
      userId,
    );

    if (!isUserExist) return false;

    await this.usersBanInfoRepository.setBanStatusForUser(
      userId,
      dto.isBanned,
      dto.isBanned ? dto.banReason : null,
      dto.isBanned ? new Date() : null,
    );

    return true;
  }
}
