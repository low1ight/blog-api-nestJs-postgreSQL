import { QueryDto } from '../../../../../../../utils/paginatorHelpers/QueryDto';

export class UserInputQueryDto extends QueryDto {
  constructor(
    pageNumber: string | undefined,
    pageSize: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    public searchLoginTerm: string | undefined,
    public searchEmailTerm: string | undefined,
    public banStatus: string | undefined,
  ) {
    super(pageNumber, pageSize, sortBy, sortDirection);
  }
}
