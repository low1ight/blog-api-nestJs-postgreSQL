import { QueryMapper } from '../../../../../../../utils/paginatorHelpers/QueryMapper';
import { BannedUsersInputQueryDto } from './BannedUsersInputQueryDto';

export class BannedUsersQueryMapper extends QueryMapper {
  searchLoginTerm: string;

  constructor({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    searchLoginTerm,
  }: BannedUsersInputQueryDto) {
    super({ sortBy, sortDirection, pageNumber, pageSize });

    this.searchLoginTerm = searchLoginTerm ? searchLoginTerm : '';
  }

  getSearchLoginTerm() {
    return this.searchLoginTerm;
  }
}
