export class UserDbModel {
  constructor(
    public id: number,
    public login: string,
    public password: string,
    public passwordRecoveryCode: string,
    public email: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
