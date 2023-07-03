import { MeType } from './MeType';

export class MeViewModel {
  public email: string;
  public login: string;
  public userId: string;

  constructor({ email, login, userId }: MeType) {
    this.email = email;
    this.login = login;
    this.userId = userId.toString();
  }
}
