import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizQuestionInputDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  correctAnswers: [];
}
