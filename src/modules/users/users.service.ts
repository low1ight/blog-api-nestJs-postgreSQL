import { Injectable } from '@nestjs/common';
import { UsersSaRepository } from './repositories/repository/sa/users.sa.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersSaRepository) {}

  async createUser(dto: { login: string; password: string; email: string }) {
    return await this.usersRepository.createUser(dto);
  }
}
