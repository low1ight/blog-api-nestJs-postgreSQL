export const userQueryMapper = ({
  searchLoginTerm,
  searchEmailTerm,
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
  banStatus,
}: UserInputQueryType): UserQueryType => {
  return {
    searchLoginTerm: searchLoginTerm || null,
    searchEmailTerm: searchEmailTerm || null,
    sortBy: sortBy || 'createdAt',
    sortDirection: sortDirection || 'desc',
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
    banStatus: banStatus || 'all',
  };
};

export type UserInputQueryType = {
  searchLoginTerm: string | undefined;
  searchEmailTerm: string | undefined;
  sortBy: string | undefined;
  sortDirection: string | undefined;
  pageNumber: string | undefined;
  pageSize: string | undefined;
  banStatus: string | undefined;
};

export type UserQueryType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
  banStatus: string;
};
