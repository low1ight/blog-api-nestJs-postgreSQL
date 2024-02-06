import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetPublishQuestionStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
