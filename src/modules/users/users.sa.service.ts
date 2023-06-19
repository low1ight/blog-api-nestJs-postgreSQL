import { Injectable } from '@nestjs/common';
import { UsersSaRepository } from './repositories/repository/sa/users.sa.repository';

@Injectable()
export class UsersSaService {
  constructor(private readonly usersRepository: UsersSaRepository) {}

  async createUser(dto: { login: string; password: string; email: string }) {
    return await this.usersRepository.createUser(dto);
  }

  async isUserEmailExist(email: string) {
    return await this.usersRepository.checkIsUserExistByField('email', email);
  }
  async isUserLoginExist(login: string) {
    return await this.usersRepository.checkIsUserExistByField('login', login);
  }

  async test() {
    return false;
  }
}
