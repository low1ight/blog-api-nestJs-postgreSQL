import { QueryDto } from '../../../../../../../utils/paginatorHelpers/QueryDto';

export class BannedUsersInputQueryDto extends QueryDto {
  constructor(
    pageNumber: string | undefined,
    pageSize: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    public searchLoginTerm: string | undefined,
  ) {
    super(pageNumber, pageSize, sortBy, sortDirection);
  }
}
