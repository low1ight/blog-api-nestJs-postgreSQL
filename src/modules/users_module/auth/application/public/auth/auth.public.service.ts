import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../../../../users/repositories/repository/users.repo';
import { UserForLoginValidationModel } from '../../../../users/repositories/dto/UserForLoginValidationModel';
import { PasswordHashAdapter } from '../../../../adapters/passwordHash.adapter';

@Injectable()
export class AuthPublicService {
  constructor(
    private readonly usersRepository: UsersRepo,
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
