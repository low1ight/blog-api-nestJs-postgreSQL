import { UserBanInfo } from '../../entities/UserBanInfo.entity';
import { UserEmailConfirmation } from '../../entities/UserEmailConfirmation.entity';
import { User } from '../../entities/User.entity';

export type UserForLoginValidationModel = User & {
  userBanInfo: UserBanInfo;
  userEmailConfirmation: UserEmailConfirmation;
};
