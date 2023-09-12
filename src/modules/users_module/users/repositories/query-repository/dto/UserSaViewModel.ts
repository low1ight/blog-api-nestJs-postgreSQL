export class UserSaViewModel {
  public id: string;
  public login: string;
  public email: string;
  public createdAt: Date;
  constructor({ id, login, email, createdAt }) {
    this.id = id.toString();
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
  }
}
