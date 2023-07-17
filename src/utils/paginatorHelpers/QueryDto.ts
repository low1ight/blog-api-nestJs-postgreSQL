export class QueryDto {
  constructor(
    public pageNumber: string | undefined,
    public pageSize: string | undefined,
    public sortBy: string | undefined,
    public sortDirection: string | undefined,
  ) {}
}
