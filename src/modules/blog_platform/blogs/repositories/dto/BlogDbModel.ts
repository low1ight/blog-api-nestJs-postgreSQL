export type BlogDbModel = {
  id: number;
  name: string;
  ownerId: number;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};
