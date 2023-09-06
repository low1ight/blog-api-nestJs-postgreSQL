import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserSaViewModel } from './dto/UserSaViewModel';
import { MeViewModel } from './dto/MeViewModel';
import { UsersQueryMapper } from '../../controllers/dto/query/users/UsersPaginator';
import { Paginator } from '../../../../../utils/paginatorHelpers/Paginator';
import { PaginatorModel } from '../../../../../utils/paginatorHelpers/paginator.types';
import { User } from '../../entities/User.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
    @InjectRepository(User)
    protected userRepository: Repository<User>,
  ) {}

  async getUsers(
    mappedQuery: UsersQueryMapper,
  ): Promise<PaginatorModel<UserSaViewModel>> {
    const loginTerm = `%${mappedQuery.getSearchLoginTerm()}%`;
    const emailTerm = `%${mappedQuery.getSearchEmailTerm()}%`;
    const banStatusObj = {
      banned: 'true',
      notbanned: 'false',
      all: 'true,false',
    };
    const isBanned = banStatusObj[mappedQuery.getUsersBanStatus()];
    const result = await this.dataSource.query(
      `

    SELECT u."id", "login", "email", "createdAt",
           b."isBanned","banDate", "banReason"
           
    FROM (
    SELECT * FROM "Users" 
    WHERE "login" ILIKE $1 OR "email" ILIKE $2
    ORDER BY "${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()}
    LIMIT ${mappedQuery.getPageSize()}
    OFFSET ${mappedQuery.getOffset()}
    ) AS u
    LEFT JOIN "UsersBanInfo" AS b
    ON u."id" = b."userId"
    WHERE "isBanned" IN(${isBanned})
    ORDER BY "${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()}
     
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

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
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
    const user = await this.userRepository.findOneBy({ id });
    // const userData: MeType[] = await this.dataSource.query(
    //   `
    //
    // SELECT "email","login","id" as "userId"
    // FROM "Users"
    // WHERE "id" = $1
    //
    // `,
    //   [id],
    // );

    return new MeViewModel(user);
  }
}
