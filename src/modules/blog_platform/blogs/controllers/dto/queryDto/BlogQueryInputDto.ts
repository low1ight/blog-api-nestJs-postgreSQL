import { QueryDto } from '../../../../../../utils/paginatorHelpers/QueryDto';

export class BlogQueryInputDto extends QueryDto {
  constructor(
    pageNumber: string | undefined,
    pageSize: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    public searchNameTerm: string | undefined,
  ) {
    super(pageNumber, pageSize, sortBy, sortDirection);
  }
}
