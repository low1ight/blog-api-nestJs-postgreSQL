export class Paginator {
  constructor(public pageSize: number, public pageNumber: number) {}

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
