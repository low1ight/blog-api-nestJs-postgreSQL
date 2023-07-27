import { IsEnum, IsNotEmpty } from 'class-validator';
import { likeStatus } from '../../../../../common/customValidators/likeStatusEnum';

export class SetLikeStatusForCommentDto {
  @IsNotEmpty()
  @IsEnum(likeStatus)
  likeStatus: string;
}
