import { Controller, Get, Post } from '@nestjs/common';
import { UsersQueryRepository } from './repository/users-query-repository.service';
import { UsersRepository } from './repository/users.repository';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Post()
  async getUsers() {
    return this.usersQueryRepository.getUsers();
  }

  @Get('c')
  async createUser() {
    return await this.usersRepository.createUser();
  }
}
