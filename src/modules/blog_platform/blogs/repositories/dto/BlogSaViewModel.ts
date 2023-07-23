import { BlogDbModeForSa } from './BlogDbModeForSa';
import { BlogViewModel } from './BlogViewModel';

export class BlogSaViewModel extends BlogViewModel {
  public blogOwnerInfo: {
    userId: number;
    userLogin: string;
  };
  public banInfo: {
    isBanned: boolean;
    banDate: Date | null;
  };
  constructor(dto: BlogDbModeForSa) {
    super(
      dto.id,
      dto.name,
      dto.description,
      dto.websiteUrl,
      dto.isMembership,
      dto.createdAt,
    );

    this.blogOwnerInfo = {
      userId: dto.userId,
      userLogin: dto.userLogin,
    };

    this.banInfo = {
      isBanned: dto.isBanned,
      banDate: dto.banDate,
    };
  }
}
