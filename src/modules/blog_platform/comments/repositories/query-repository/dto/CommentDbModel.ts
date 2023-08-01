export type CommentDbModelWithLikes = {
  id: number;
  content: string;
  userId: number;
  userLogin: string;
  createdAt: Date;
  totalLikesCount: string;
  totalDislikesCount: string;
  myStatus: null | string;
};
