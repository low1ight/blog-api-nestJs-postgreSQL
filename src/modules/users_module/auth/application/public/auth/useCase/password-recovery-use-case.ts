import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../../../../../../adapters/email.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../../../../users/repositories/repository/users-repo.service';

export class PasswordRecoveryUseCaseCommand {
  constructor(public email: string) {}
}
@CommandHandler(PasswordRecoveryUseCaseCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepo,
    private emailManager: EmailManager,
  ) {}

  async execute({ email }: PasswordRecoveryUseCaseCommand) {
    const userId: number | null = await this.usersRepository.getUserIdByEmail(
      email,
    );

    if (!userId) return;

    const passwordRecoveryCode = uuidv4();

    await this.usersRepository.updatePasswordRecoveryCode(
      userId,
      passwordRecoveryCode,
    );

    await this.emailManager.sendPasswordRecoveryCode(
      email,
      passwordRecoveryCode,
    );
  }
}
