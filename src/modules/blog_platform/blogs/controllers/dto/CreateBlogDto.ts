export type CreateBlogDto = {
  name: string;
  ownerId: number;
  description: string;
  isMembership: boolean;
  websiteUrl: string;
};
