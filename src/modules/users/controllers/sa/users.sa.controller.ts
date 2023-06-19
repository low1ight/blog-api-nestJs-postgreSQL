import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersQueryRepository } from '../../repositories/query-repository/sa/users-query-repository';
import { CreateUserDto } from './dto/CreateUserDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserUseCaseCommand } from '../../application/use-cases/create-user-use-case';

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    protected commandBus: CommandBus,
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
    return await this.commandBus.execute(new CreateUserUseCaseCommand(dto));
  }
}
