import { PostDbModelWithBlogName } from './PostDbModelWithBlogName';

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      addedAt: Date;
      userId: number;
      login: string;
    }[];
  };
  constructor({
    id,
    title,
    content,
    shortDescription,
    blogId,
    blogName,
    createdAt,
  }: PostDbModelWithBlogName) {
    this.id = id.toString();
    this.title = title;
    this.content = content;
    this.shortDescription = shortDescription;
    this.blogId = blogId.toString();
    this.blogName = blogName;
    this.createdAt = createdAt;
    this.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
  }
}
