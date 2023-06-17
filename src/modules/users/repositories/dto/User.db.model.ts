export class UserDbModel {
  constructor(
    public id: number,
    public login: string,
    public password: string,
    public passwordRecoveryCode: string,
    public email: string,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
