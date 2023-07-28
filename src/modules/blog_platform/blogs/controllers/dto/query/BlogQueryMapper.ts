import { QueryMapper } from '../../../../../../utils/paginatorHelpers/QueryMapper';
import { BlogQueryInputDto } from './BlogQueryInputDto';

export class BlogQueryMapper extends QueryMapper {
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
