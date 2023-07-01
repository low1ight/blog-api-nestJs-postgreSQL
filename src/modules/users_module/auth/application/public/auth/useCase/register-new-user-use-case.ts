import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../../users/repositories/repository/users.repository';
import { UsersEmailConfirmationRepository } from '../../../../../users/repositories/repository/usersEmailConfirmation.repository';
import { UsersBanInfoRepository } from '../../../../../users/repositories/repository/usersBanInfo.repository';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../../../../users/controllers/dto/CreateUserDto';
import { EmailManager } from '../../../../../../../adapters/email.manager';
import { PasswordHashAdapter } from '../../../../../adapters/passwordHash.adapter';

export class RegisterNewUserUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}
@CommandHandler(RegisterNewUserUseCaseCommand)
export class RegisterNewUserUseCase
  implements ICommandHandler<RegisterNewUserUseCaseCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersEmailConfirmationRepository: UsersEmailConfirmationRepository,
    private readonly usersBanInfoRepository: UsersBanInfoRepository,
    private readonly emailManager: EmailManager,
    private readonly passwordHashAdapter: PasswordHashAdapter,
  ) {}

  async execute({ dto }: RegisterNewUserUseCaseCommand) {
    const emailConfirmationCode = uuidv4();

    const hashedPassword = await this.passwordHashAdapter.hashPassword(
      dto.password,
    );

    const createdUserId = await this.usersRepository.createUser({
      ...dto,
      password: hashedPassword,
    });

    await this.usersBanInfoRepository.createUserBanInfo(createdUserId);
    await this.usersEmailConfirmationRepository.createUnconfirmedEmailConfirmationFofUser(
      createdUserId,
      emailConfirmationCode,
    );

    await this.emailManager.sendConfirmationCode(
      dto.email,
      emailConfirmationCode,
    );
  }
}
