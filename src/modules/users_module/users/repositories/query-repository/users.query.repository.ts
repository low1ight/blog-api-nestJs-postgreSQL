import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserSaViewModel } from './dto/UserSaViewModel';
import { UserQueryType } from '../../../../../utils/querryMapper/user-query-mapper';
import { calcSkipCount } from '../../../../../utils/paginatorHelpers/calcSkipCount';
import { toViwModelWithPaginator } from '../../../../../utils/paginatorHelpers/toViwModelWithPaginator';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getUsers({
    pageSize,
    pageNumber,
    searchLoginTerm,
    searchEmailTerm,
    banStatus,
    sortDirection,
    sortBy,
  }: UserQueryType) {
    const offset = calcSkipCount(pageNumber, pageSize);
    const direction = sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const loginTerm = `%${searchLoginTerm || ''}%`;
    const emailTerm = `%${searchEmailTerm || ''}%`;
    const banStatusObj = {
      banned: true,
      notBanned: false,
    };
    let isBanned = banStatusObj[banStatus];
    if (!(typeof isBanned === 'boolean')) isBanned = 'false,true';
    const result = await this.dataSource.query(
      `

    SELECT u."id", "login", "email", "createdAt",
           b."isBanned","banDate", "banReason"
           
    FROM (
    SELECT * FROM "Users" 
    WHERE "login" ILIKE $1 OR "email" ILIKE $2
    ORDER BY "${sortBy}" ${direction}
    LIMIT ${pageSize}
    OFFSET ${offset}
    ) AS u
    LEFT JOIN "UsersBanInfo" AS b
    ON u."id" = b."userId"
    WHERE "isBanned" IN(${isBanned})
    ORDER BY "${sortBy}" ${direction}
     
    `,
      [loginTerm, emailTerm],
    );

    const totalElem = await this.dataSource.query(
      `
    SELECT Count(*)
           
    FROM (
    SELECT * FROM "Users" 
    WHERE "login" ILIKE $1 OR "email" ILIKE $2
    ) u
    LEFT JOIN "UsersBanInfo" b
    ON u."id" = b."userId"
    WHERE "isBanned" IN(${isBanned})
    `,
      [loginTerm, emailTerm],
    );

    const userViewModel: UserSaViewModel[] = result.map(
      (user) => new UserSaViewModel(user),
    );

    return toViwModelWithPaginator(
      userViewModel,
      pageNumber,
      pageSize,
      +totalElem[0].count,
    );
  }

  async getUserById(userId: number) {
    const user = await this.dataSource.query(
      `
    
    SELECT u."id", "login", "email", "createdAt",
           b."isBanned", "banReason", "banDate"
    FROM public."Users" u
    LEFT JOIN "UsersBanInfo" b ON u.id = b."userId"
    WHERE "id" = $1
    
    
    `,
      [userId],
    );

    return new UserSaViewModel(user[0]);
  }
}
