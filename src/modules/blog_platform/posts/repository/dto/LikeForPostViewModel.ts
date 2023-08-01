export class LikeForPostViewModel {
  public userId: string;
  constructor(userId: number, public login: string, public addedAt: Date) {
    this.userId = userId.toString();
  }
}
