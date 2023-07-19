import { Paginator } from '../../../../../../utils/paginatorHelpers/Paginator';
import { BlogQueryInputDto } from './BlogQueryInputDto';

export class BlogPaginator extends Paginator {
  searchNameTerm: string;
  constructor({
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
  }: BlogQueryInputDto) {
    super({ pageNumber, pageSize, sortBy, sortDirection });
    this.searchNameTerm = searchNameTerm ? searchNameTerm : '';
  }

  getSearchNameTerm() {
    return this.searchNameTerm;
  }
}
