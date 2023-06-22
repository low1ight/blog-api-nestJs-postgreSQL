import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../repositories/sa/query-repository/users-query-repository';
import { CreateUserDto } from './dto/CreateUserDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserUseCaseCommand } from '../../application/sa/use-cases/create-user-use-case';
import { DeleteUserUseCaseCommand } from '../../application/sa/use-cases/delete-user-use-case';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../../../../../utils/querryMapper/user-query-mapper';

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    protected commandBus: CommandBus,
  ) {}

  @Get()
  async getUsers(@Query() query: UserInputQueryType) {
    const mappedQuery = userQueryMapper(query);

    return this.usersQueryRepository.getUsers(mappedQuery);
  }

  @Post('')
  async createUser(
    @Body()
    dto: CreateUserDto,
  ) {
    return await this.commandBus.execute(new CreateUserUseCaseCommand(dto));
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const isDeleted = await this.commandBus.execute(
      new DeleteUserUseCaseCommand(id),
    );

    if (!isDeleted) throw new NotFoundException();
  }
}
