import { IsUrl, MaxLength } from 'class-validator';

export class CreateBlogInputDto {
  @MaxLength(15)
  name: string;

  @MaxLength(500)
  description: string;

  @MaxLength(100)
  @IsUrl()
  websiteUrl: string;
}
