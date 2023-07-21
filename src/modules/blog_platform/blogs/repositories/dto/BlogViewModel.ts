export class BlogViewModel {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public isMembership: boolean,
    public createdAt: Date,
  ) {}
}
