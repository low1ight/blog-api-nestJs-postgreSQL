export class UserBanInfoDbModel {
  constructor(
    public userId: number,
    public isBanned: boolean,
    public banReason: string,
    public banDate: Date,
  ) {}
}
