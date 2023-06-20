import { Injectable } from '@nestjs/common';
import { UsersSaRepository } from '../repositories/sa/repository/sa/users.sa.repository';

@Injectable()
export class UsersSaService {
  constructor(private readonly usersRepository: UsersSaRepository) {}

  async isUserEmailExist(email: string) {
    return await this.usersRepository.checkIsUserExistByField('email', email);
  }
  async isUserLoginExist(login: string) {
    return await this.usersRepository.checkIsUserExistByField('login', login);
  }
}
