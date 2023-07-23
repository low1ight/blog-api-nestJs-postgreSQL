export class BlogViewModel {
  public id: string;
  public name: string;
  public description: string;
  public websiteUrl: string;
  public isMembership: boolean;
  public createdAt: Date;
  constructor({ id, name, description, websiteUrl, isMembership, createdAt }) {
    this.id = id.toString();
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.isMembership = isMembership;
    this.createdAt = createdAt;
  }
}
