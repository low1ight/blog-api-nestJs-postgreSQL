import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../../users/repositories/public/repository/users.repository';
import { UsersEmailConfirmationRepository } from '../../../../../users/repositories/public/repository/usersEmailConfirmation.repository';
import { UsersBanInfoRepository } from '../../../../../users/repositories/public/repository/usersBanInfo.repository';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../../../../users/controllers/sa/dto/CreateUserDto';
import { EmailManager } from '../../../../../../../adapters/email.manager';

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
  ) {}

  async execute({ dto }: RegisterNewUserUseCaseCommand) {
    const emailConfirmationCode = uuidv4();

    const createdUserId = await this.usersRepository.createUser(dto);

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
