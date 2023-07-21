import { Paginator } from '../../../../../../../utils/paginatorHelpers/Paginator';
import { BannedUsersInputQueryDto } from './BannedUsersInputQueryDto';

export class BannedUsersPaginator extends Paginator {
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
