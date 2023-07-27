export type CommentLikeDbModel = {
  commentId: number;
  userId: number;
  likeStatus: string;
  createdAt: Date;
};
