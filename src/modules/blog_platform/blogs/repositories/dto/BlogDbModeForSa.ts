import { BlogDbModel } from './BlogDbModel';

export type BlogDbModeForSa = {
  isBanned: boolean;
  banDate: Date | null;
  userId: number;
  userLogin: string;
} & BlogDbModel;
