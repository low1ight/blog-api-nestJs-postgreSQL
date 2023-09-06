import { User } from '../../../entities/User.entity';

export class MeViewModel {
  public email: string;
  public login: string;
  public userId: string;

  constructor({ email, login, id }: User) {
    this.email = email;
    this.login = login;
    this.userId = id.toString();
  }
}
