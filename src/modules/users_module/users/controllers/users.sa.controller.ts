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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserUseCaseCommand } from '../application/use-cases/create-user-use-case';
import { DeleteUserUseCaseCommand } from '../application/use-cases/delete-user-use-case';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../../../../utils/querryMapper/user-query-mapper';
import { SetBanStatusForUserUseCaseCommand } from '../application/use-cases/set-ban-status-for-user-use-case';
import { BanUserDto } from './dto/BanUserDto';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { UsersQueryRepository } from '../repositories/query-repository/users.query.repository';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
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
    const createdUserId: number = await this.commandBus.execute(
      new CreateUserUseCaseCommand(dto),
    );

    return await this.usersQueryRepository.getUserById(createdUserId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', CustomParseInt) id: number) {
    const isDeleted = await this.commandBus.execute(
      new DeleteUserUseCaseCommand(id),
    );

    if (!isDeleted) throw new NotFoundException();
  }

  @Put(':id/ban')
  @HttpCode(204)
  async setBanStatusForUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BanUserDto,
  ) {
    const isSuccessfulSet = await this.commandBus.execute(
      new SetBanStatusForUserUseCaseCommand(id, dto),
    );

    if (!isSuccessfulSet) throw new NotFoundException();
  }
}
