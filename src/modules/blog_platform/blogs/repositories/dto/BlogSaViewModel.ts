import { BlogDbModeForSa } from './BlogDbModeForSa';
import { BlogViewModel } from './BlogViewModel';

export class BlogSaViewModel extends BlogViewModel {
  public blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
  public banInfo: {
    isBanned: boolean;
    banDate: Date | null;
  };
  constructor({
    id,
    name,
    description,
    websiteUrl,
    isMembership,
    createdAt,
    userLogin,
    userId,
    isBanned,
    banDate,
  }: BlogDbModeForSa) {
    super({ id, name, description, websiteUrl, isMembership, createdAt });

    this.blogOwnerInfo = {
      userId: userId.toString(),
      userLogin,
    };

    this.banInfo = {
      isBanned,
      banDate,
    };
  }
}
