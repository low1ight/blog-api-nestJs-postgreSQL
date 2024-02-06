import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizQuestionInputDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  correctAnswers: string[];
}
