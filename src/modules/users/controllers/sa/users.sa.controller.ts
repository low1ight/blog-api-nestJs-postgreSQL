import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersQueryRepository } from '../../repositories/query-repository/sa/users-query-repository';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersSaService } from '../../users.sa.service';

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersSaService,
  ) {}

  @Get()
  async getUsers() {
    return this.usersQueryRepository.getUsers();
  }

  @Post('')
  async createUser(
    @Body()
    dto: CreateUserDto,
  ) {
    return await this.usersService.createUser(dto);
  }
}
