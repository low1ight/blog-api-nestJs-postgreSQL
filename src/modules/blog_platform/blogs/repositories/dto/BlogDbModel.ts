export type BlogDbModel = {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};
