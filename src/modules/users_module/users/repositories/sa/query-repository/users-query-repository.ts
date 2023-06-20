import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserSaViewModel } from './dto/UserSaViewModel';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getUsers() {
    const result = await this.dataSource.query(`

    SELECT u."id", "login", "email", "createdAt",
           b."isBanned","banDate", "banReason"
           
    FROM public."Users" u
    LEFT JOIN "UsersBanInfo" b
    ON u."id" = b."userId"
    
    `);

    return result.map((user) => new UserSaViewModel(user));
  }
}
