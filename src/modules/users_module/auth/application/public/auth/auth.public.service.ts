import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../users/repositories/repository/users.repository';
import { UserForLoginValidationModel } from '../../../../users/repositories/dto/UserForLoginValidationModel';
import { PasswordHashAdapter } from '../../../../adapters/passwordHash.adapter';

@Injectable()
export class AuthPublicService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashAdapter: PasswordHashAdapter,
  ) {}
  async validateUser(loginOrEmail: string, password: string) {
    const user: UserForLoginValidationModel | null =
      await this.usersRepository.getUserDataForLogin(loginOrEmail);

    if (!user) return null;

    const isPasswordCorrect = await this.passwordHashAdapter.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordCorrect) return null;
    return user;
  }
}
