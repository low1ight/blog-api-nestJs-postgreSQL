import { CommentDbModelWithLikes } from './CommentDbModel';

export class CommentViewModel {
  id: string;
  content: string;
  createdAt: Date;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  constructor({
    id,
    content,
    userLogin,
    userId,
    createdAt,
    totalLikesCount,
    totalDislikesCount,
    myStatus,
  }: CommentDbModelWithLikes) {
    this.id = id.toString();
    this.content = content;
    this.createdAt = createdAt;
    this.commentatorInfo = {
      userId: userId.toString(),
      userLogin,
    };
    this.likesInfo = {
      likesCount: Number(totalLikesCount),
      dislikesCount: Number(totalDislikesCount),
      myStatus: myStatus || 'None',
    };
  }
}
