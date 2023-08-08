import {
  CommentDbModelWithLikes,
  CommentDbModelWithLikesAndBlogPostData,
} from './CommentDbModel';

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

export class AllBlogsCommentViewModel extends CommentViewModel {
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
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
    blogId,
    blogName,
    postId,
    postTitle,
  }: CommentDbModelWithLikesAndBlogPostData) {
    super({
      id,
      content,
      userLogin,
      userId,
      createdAt,
      totalLikesCount,
      totalDislikesCount,
      myStatus,
    });

    this.postInfo = {
      id: postId.toString(),
      title: postTitle,
      blogId: blogId.toString(),
      blogName: blogName,
    };
  }
}
