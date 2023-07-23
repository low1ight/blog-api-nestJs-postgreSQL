import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateBlogInputDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsUrl()
  websiteUrl: string;
}
