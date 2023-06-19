export type UserBanInfoDbModel = {
  userId: number;
  isBanned: boolean;
  banReason: string;
  banDate: Date;
};
