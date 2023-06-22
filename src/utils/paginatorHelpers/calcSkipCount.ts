export const calcSkipCount = (page: number, pageSize: number) =>
  (page - 1) * pageSize;
