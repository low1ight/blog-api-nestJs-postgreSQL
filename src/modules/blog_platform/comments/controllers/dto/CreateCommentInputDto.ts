import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentInputDto {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
