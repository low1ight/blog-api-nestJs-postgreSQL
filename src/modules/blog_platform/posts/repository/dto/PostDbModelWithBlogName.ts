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
