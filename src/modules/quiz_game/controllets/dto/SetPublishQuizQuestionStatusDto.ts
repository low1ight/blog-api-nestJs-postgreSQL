import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetPublishQuizQuestionStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
