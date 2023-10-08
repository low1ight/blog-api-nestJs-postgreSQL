import { LikeForPostViewModel } from './LikeForPostViewModel';

import { PostsWithBlogDataAndLikesRaw } from './PostDbModelWithBlogName';

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: LikeForPostViewModel[];
  };
  constructor({
    id,
    title,
    content,
    shortDescription,
    blogId,
    blogName,
    createdAt,
    totalLikesCount,
    totalDislikesCount,
    myStatus,
  }: PostsWithBlogDataAndLikesRaw) {
    this.id = id.toString();
    this.title = title;
    this.content = content;
    this.shortDescription = shortDescription;
    this.blogId = blogId.toString();
    this.blogName = blogName;
    this.createdAt = createdAt;
    this.extendedLikesInfo = {
      likesCount: Number(totalLikesCount),
      dislikesCount: Number(totalDislikesCount),
      myStatus: myStatus || 'None',
      newestLikes: [],
    };
  }
}
