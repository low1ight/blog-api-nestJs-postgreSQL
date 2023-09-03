import { NewPasswordDto } from '../../controllers/dto/NewPasswordDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../repositories/repository/users.repo';
import { PasswordHashAdapter } from '../../../adapters/passwordHash.adapter';

export class SetNewPasswordUseCaseCommand {
  constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(SetNewPasswordUseCaseCommand)
export class SetNewPasswordUseCase
  implements ICommandHandler<SetNewPasswordUseCaseCommand>
{
  constructor(
    private readonly usersRepository: UsersRepo,
    private readonly passwordHashAdapter: PasswordHashAdapter,
  ) {}

  async execute({ dto }: SetNewPasswordUseCaseCommand): Promise<boolean> {
    const userId: number | null =
      await this.usersRepository.getUserIdByPasswordRecoveryCode(
        dto.recoveryCode,
      );

    if (!userId) return false;

    const hashedPassword: string = await this.passwordHashAdapter.hashPassword(
      dto.newPassword,
    );

    await this.usersRepository.setNewPassword(userId, hashedPassword);
    await this.usersRepository.updatePasswordRecoveryCode(userId, null);

    return true;
  }
}
