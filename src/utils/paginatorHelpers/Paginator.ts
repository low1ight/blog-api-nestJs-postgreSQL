import { QueryDto } from './QueryDto';

export class Paginator {
  protected defaultValues = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  };

  protected sortDirections = ['ASC', 'DESC'];

  protected pageNumber: number;
  protected pageSize: number;
  protected sortBy: string;
  protected sortDirection: string;
  constructor({ pageNumber, pageSize, sortBy, sortDirection }: QueryDto) {
    this.pageNumber = Number(pageNumber) || this.defaultValues.pageNumber;
    this.pageSize = Number(pageSize) || this.defaultValues.pageSize;
    this.sortBy = sortBy || this.defaultValues.sortBy;
    this.sortDirection = sortDirection || this.defaultValues.sortDirection;
  }

  getOffset() {
    return (this.pageNumber - 1) * this.pageSize;
  }

  getPageSize() {
    return this.pageSize;
  }
  getSortBy() {
    return this.sortBy;
  }

  getSortDirection() {
    return this.sortDirections.includes(this.sortDirection.toUpperCase())
      ? this.sortDirection
      : this.defaultValues.sortDirection;
  }

  calculatePageCount(totalElemCount: number, pageSize: number) {
    let defaultCount = totalElemCount;

    if (totalElemCount < 1) defaultCount = 1;

    return Math.ceil(defaultCount / pageSize);
  }

  paginate(items: any[], totalElemCount: number) {
    return {
      pagesCount: this.calculatePageCount(totalElemCount, this.pageSize),
      page: this.pageNumber,
      pageSize: this.pageSize,
      totalCount: totalElemCount,
      items,
    };
  }
}
