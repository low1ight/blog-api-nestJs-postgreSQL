import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSaViewModel } from './dto/UserSaViewModel';
import { MeViewModel } from './dto/MeViewModel';
import { UsersQueryMapper } from '../../controllers/dto/query/users/UsersPaginator';
import { Paginator } from '../../../../../utils/paginatorHelpers/Paginator';
import { User } from '../../entities/User.entity';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectRepository(User)
    protected userRepository: Repository<User>,
  ) {}

  async getUsers(mappedQuery: UsersQueryMapper) {
    const loginTerm = `%${mappedQuery.getSearchLoginTerm()}%`;
    const emailTerm = `%${mappedQuery.getSearchEmailTerm()}%`;

    const orderBy = 'user.' + mappedQuery.getSortBy();
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login ILIKE :login', { login: loginTerm })
      .orWhere('user.email ILIKE :email', { email: emailTerm })
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize())
      .offset(mappedQuery.getOffset())
      .getMany();

    const totalCount = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login ILIKE :login', { login: loginTerm })
      .orWhere('user.email ILIKE :email', { email: emailTerm })
      .getCount();

    const userViewModel: UserSaViewModel[] = users.map(
      (user) => new UserSaViewModel(user),
    );

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(userViewModel, totalCount);
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    return user ? new UserSaViewModel(user) : null;
  }

  async getUserDataForAuthMe(id: number): Promise<MeViewModel> {
    const user = await this.userRepository.findOneBy({ id });

    return new MeViewModel(user);
  }
}
