import { CommentDbModelWithLikes } from './CommentDbModel';

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likeInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  constructor({
    id,
    content,
    userLogin,
    userId,
    totalLikesCount,
    totalDislikesCount,
    myStatus,
  }: CommentDbModelWithLikes) {
    this.id = id.toString();
    this.content = content;
    this.commentatorInfo = {
      userId: userId.toString(),
      userLogin,
    };
    this.likeInfo = {
      likesCount: Number(totalLikesCount),
      dislikesCount: Number(totalDislikesCount),
      myStatus: myStatus || 'None',
    };
  }
}
