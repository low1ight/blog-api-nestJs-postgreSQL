export type BannedUserBloggerDbModel = {
  id: number;
  banReason: string;
  login: string;
  banDate: Date;
};

export class BannedUsersBloggerViewModel {
  id: number;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };
  constructor({ id, banDate, login, banReason }: BannedUserBloggerDbModel) {
    this.id = id;
    this.login = login;
    this.banInfo = {
      isBanned: true,
      banReason: banReason,
      banDate: banDate,
    };
  }
}
