import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCommentInputDto {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
