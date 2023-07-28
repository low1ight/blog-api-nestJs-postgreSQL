import { UserInputQueryDto } from './UsersInputQueryDto';
import { QueryMapper } from '../../../../../../../utils/paginatorHelpers/QueryMapper';

export class UsersQueryMapper extends QueryMapper {
  searchEmailTerm: string;
  searchLoginTerm: string;
  banStatus: string;

  availableBanStatuses = ['all', 'banned', 'notbanned'];
  constructor({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    searchEmailTerm,
    searchLoginTerm,
    banStatus,
  }: UserInputQueryDto) {
    super({ sortBy, sortDirection, pageNumber, pageSize });
    this.searchEmailTerm = searchEmailTerm ? searchEmailTerm : '';
    this.searchLoginTerm = searchLoginTerm ? searchLoginTerm : '';
    this.banStatus = banStatus ? banStatus.toLowerCase() : 'all';
  }

  getSearchEmailTerm() {
    return this.searchEmailTerm;
  }
  getSearchLoginTerm() {
    return this.searchLoginTerm;
  }

  getUsersBanStatus() {
    return this.availableBanStatuses.includes(this.banStatus)
      ? this.banStatus
      : 'all';
  }
}
