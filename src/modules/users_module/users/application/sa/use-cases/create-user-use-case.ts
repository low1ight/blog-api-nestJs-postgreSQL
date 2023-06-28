import { CreateUserDto } from '../../../controllers/sa/dto/CreateUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordHashAdapter } from '../../../../adapters/passwordHash.adapter';
import { UsersRepository } from '../../../repositories/public/repository/users.repository';
import { UsersBanInfoRepository } from '../../../repositories/public/repository/usersBanInfo.repository';
import { UsersEmailConfirmationRepository } from '../../../repositories/public/repository/usersEmailConfirmation.repository';

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
    private userBanInfoRepository: UsersBanInfoRepository,
    private userEmailConfirmationRepository: UsersEmailConfirmationRepository,
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

    const userId: number = await this.usersRepository.createUser(
      userDtoWithHashedPassword,
    );
    await this.userBanInfoRepository.createUserBanInfo(userId);
    await this.userEmailConfirmationRepository.createAutoConfirmedEmailConfirmationFofUser(
      userId,
    );

    return userId;
  }
}
