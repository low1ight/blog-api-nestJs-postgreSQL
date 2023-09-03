import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repositories/repository/users-repo.service';
import { CreateUserDto } from '../controllers/dto/CreateUserDto';
import { PasswordHashAdapter } from '../../adapters/passwordHash.adapter';
import { UsersBanInfoRepository } from '../repositories/repository/usersBanInfo.repository';
import { UsersEmailConfirmationRepository } from '../repositories/repository/usersEmailConfirmation.repository';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../../../adapters/email.manager';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepo,
    private readonly passwordHashAdapter: PasswordHashAdapter,
    private readonly usersBanInfoRepository: UsersBanInfoRepository,
    private readonly usersEmailConfirmationRepository: UsersEmailConfirmationRepository,
    private readonly emailManager: EmailManager,
    private readonly dataSource: DataSource,
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

    //transaction connect
    let userId: number;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      userId = await this.usersRepository.createUser(
        userDtoWithHashedPassword,
        queryRunner,
      );

      await this.usersBanInfoRepository.createUserBanInfo(userId, queryRunner);

      if (isEmailAutoConfirmed) {
        await this.usersEmailConfirmationRepository.createAutoConfirmedEmailConfirmationFofUser(
          userId,
          queryRunner,
        );
      } else {
        const emailConfirmationCode = uuidv4();

        await this.usersEmailConfirmationRepository.createUnconfirmedEmailConfirmationFofUser(
          userId,
          emailConfirmationCode,
          queryRunner,
        );

        await this.emailManager.sendConfirmationCode(
          dto.email,
          emailConfirmationCode,
        );
      }

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
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
