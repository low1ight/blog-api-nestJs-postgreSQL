import { BlogViewModel } from './BlogViewModel';
import { Blog } from '../../entity/Blog.entity';
import { User } from '../../../../users_module/users/entities/User.entity';

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
    user,
    isBanned,
    banDate,
  }: Blog & { user: User }) {
    super({ id, name, description, websiteUrl, isMembership, createdAt });

    this.blogOwnerInfo = {
      userId: user.id.toString(),
      userLogin: user.login,
    };

    this.banInfo = {
      isBanned,
      banDate,
    };
  }
}
