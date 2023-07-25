import { IsEnum, IsNotEmpty } from 'class-validator';
import { likeStatus } from '../../../../../common/customValidators/likeStatusEnum';

export class SetLikeStatusForPostDto {
  @IsNotEmpty()
  @IsEnum(likeStatus)
  likeStatus: string;
}
