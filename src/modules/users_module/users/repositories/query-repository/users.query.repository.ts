import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserSaViewModel } from './dto/UserSaViewModel';
import { MeViewModel } from './dto/MeViewModel';
import { MeType } from './dto/MeType';
import { UsersPaginator } from '../../controllers/dto/query/users/UsersPaginator';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getUsers(paginator: UsersPaginator) {
    const loginTerm = `%${paginator.getSearchLoginTerm()}%`;
    const emailTerm = `%${paginator.getSearchEmailTerm()}%`;
    const banStatusObj = {
      banned: 'true',
      notbanned: 'false',
      all: 'true,false',
    };
    const isBanned = banStatusObj[paginator.getUsersBanStatus()];
    const result = await this.dataSource.query(
      `

    SELECT u."id", "login", "email", "createdAt",
           b."isBanned","banDate", "banReason"
           
    FROM (
    SELECT * FROM "Users" 
    WHERE "login" ILIKE $1 OR "email" ILIKE $2
    ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
    LIMIT ${paginator.getPageSize()}
    OFFSET ${paginator.getOffset()}
    ) AS u
    LEFT JOIN "UsersBanInfo" AS b
    ON u."id" = b."userId"
    WHERE "isBanned" IN(${isBanned})
    ORDER BY "${paginator.getSortBy()}" ${paginator.getSortDirection()}
     
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

    return paginator.paginate(userViewModel, Number(totalElem[0].count));
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

  async getUserDataForAuthMe(id): Promise<MeViewModel> {
    const userData: MeType[] = await this.dataSource.query(
      `
    
    SELECT "email","login","id" as "userId"
    FROM "Users"    
    WHERE "id" = $1
    
    `,
      [id],
    );

    return new MeViewModel(userData[0]);
  }
}
