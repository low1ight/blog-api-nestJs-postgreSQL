import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersQueryRepository } from '../../repositories/query-repository/users-query-repository.service';
import { UsersService } from '../../users.service';

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getUsers() {
    return this.usersQueryRepository.getUsers();
  }

  @Post('')
  async createUser(
    @Body()
    dto: {
      login: string;
      password: string;
      email: string;
    },
  ) {
    return await this.usersService.createUser(dto);
  }
}
