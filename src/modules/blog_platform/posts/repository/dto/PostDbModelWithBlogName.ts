import { LikeForPostViewModel } from './LikeForPostViewModel';

export type PostsWithBlogDataAndLikesRaw = {
  id: number;
  blogId: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: Date;
  blogName: string;
  totalLikesCount: string;
  totalDislikesCount: string;
  myStatus: null | string;
  likeUserId: number;
  likeAddedAt: Date;
  likeUserLogin: string;
  newestLikes: LikeForPostViewModel[];
};

export type GroupedPostsWithBlogDataAndLikesRaw = {
  id: number;
  blogId: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: Date;
  blogName: string;
  totalLikesCount: string;
  totalDislikesCount: string;
  myStatus: null | string;
  likes: [
    {
      likeUserId: number;
      likeAddedAt: Date;
      likeUserLogin: string;
    },
  ];
};
