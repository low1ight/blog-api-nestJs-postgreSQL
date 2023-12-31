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
import { SetBanStatusForUserUseCaseCommand } from '../application/use-cases/set-ban-status-for-user-use-case';
import { BanUserDto } from './dto/BanUserDto';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { UsersQueryRepo } from '../repositories/query-repository/users.query.repo';
import { CustomParseInt } from '../../../../common/customPipe/customParseInt';
import { UsersQueryMapper } from './dto/query/users/UsersPaginator';
import { UserInputQueryDto } from './dto/query/users/UsersInputQueryDto';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersSaController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepo,
    protected commandBus: CommandBus,
  ) {}

  @Get()
  async getUsers(@Query() query: UserInputQueryDto) {
    const mappedQuery = new UsersQueryMapper(query);

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
