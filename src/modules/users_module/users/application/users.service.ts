import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async isUserEmailExist(email: string) {
    return await this.usersRepository.checkIsUserExistByField('email', email);
  }
  async isUserLoginExist(login: string) {
    return await this.usersRepository.checkIsUserExistByField('login', login);
  }
}
