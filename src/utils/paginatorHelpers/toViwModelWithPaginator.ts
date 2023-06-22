import { PaginatorModel } from './paginator.types';

const calculatePageCount = (pageCount: number, pageSize: number) => {
  let defaultCount = pageCount;

  if (pageCount < 1) defaultCount = 1;

  return Math.ceil(defaultCount / pageSize);
};

export const toViwModelWithPaginator = (
  items: any[],
  pageNumber: number,
  pageSize: number,
  elementCount: number,
): PaginatorModel<any[]> => {
  return {
    pagesCount: calculatePageCount(elementCount, pageSize),
    page: pageNumber,
    pageSize: pageSize,
    totalCount: elementCount,
    items,
  };
};
