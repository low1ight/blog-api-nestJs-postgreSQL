import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/repository/users.repository';
import { CreateUserDto } from '../controllers/dto/CreateUserDto';
import { PasswordHashAdapter } from '../../adapters/passwordHash.adapter';
import { UsersBanInfoRepository } from '../repositories/repository/usersBanInfo.repository';
import { UsersEmailConfirmationRepository } from '../repositories/repository/usersEmailConfirmation.repository';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../../../adapters/email.manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashAdapter: PasswordHashAdapter,
    private readonly usersBanInfoRepository: UsersBanInfoRepository,
    private readonly usersEmailConfirmationRepository: UsersEmailConfirmationRepository,
    private readonly emailManager: EmailManager,
  ) {}

  async createUser(dto: CreateUserDto, isEmailAutoConfirmed: boolean) {
    //hashing user password
    //
    const hashedPassword = await this.passwordHashAdapter.hashPassword(
      dto.password,
    );
    const userDtoWithHashedPassword: CreateUserDto = {
      ...dto,
      password: hashedPassword,
    };
    //create user
    //
    const userId: number = await this.usersRepository.createUser(
      userDtoWithHashedPassword,
    );
    await this.usersBanInfoRepository.createUserBanInfo(userId);

    if (isEmailAutoConfirmed) {
      await this.usersEmailConfirmationRepository.createAutoConfirmedEmailConfirmationFofUser(
        userId,
      );
    } else {
      const emailConfirmationCode = uuidv4();

      await this.usersEmailConfirmationRepository.createUnconfirmedEmailConfirmationFofUser(
        userId,
        emailConfirmationCode,
      );

      await this.emailManager.sendConfirmationCode(
        dto.email,
        emailConfirmationCode,
      );
    }

    return userId;
  }

  async isUserEmailExist(email: string) {
    return await this.usersRepository.checkIsUserExistByField('email', email);
  }
  async isUserLoginExist(login: string) {
    return await this.usersRepository.checkIsUserExistByField('login', login);
  }
}
