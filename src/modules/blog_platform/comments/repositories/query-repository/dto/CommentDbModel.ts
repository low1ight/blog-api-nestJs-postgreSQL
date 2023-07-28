export type CommentDbModelWithLikes = {
  id: number;
  content: string;
  userId: number;
  userLogin: string;
  totalLikesCount: string;
  totalDislikesCount: string;
  myStatus: null | string;
};
