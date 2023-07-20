import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BanUserForBlogDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  banReason: string;

  @IsNotEmpty()
  @IsString()
  blogId: string;
}
