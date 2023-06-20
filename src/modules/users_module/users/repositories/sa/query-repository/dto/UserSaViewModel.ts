export class UserSaViewModel {
  public id: string;
  public login: string;
  public email: string;
  public createdAt: Date;
  public banInfo: {
    isBanned: boolean;
    banDate: Date | null;
    banReason: string | null;
  };
  constructor({ id, login, email, createdAt, isBanned, banDate, banReason }) {
    this.id = id.toString();
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
    this.banInfo = {
      isBanned,
      banDate,
      banReason,
    };
  }
}
