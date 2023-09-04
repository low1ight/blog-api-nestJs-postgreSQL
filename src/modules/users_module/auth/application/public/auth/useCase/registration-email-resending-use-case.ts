import { CustomResponse } from '../../../../../../../utils/customResponse/CustomResponse';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../../../../../../adapters/email.manager';
import { CustomResponseEnum } from '../../../../../../../utils/customResponse/CustomResponseEnum';
import { UserConfirmedStatusWithId } from '../../../../../users/repositories/dto/User.confirmed.status.withId';
import { UsersEmailConfirmationRepo } from '../../../../../users/repositories/repository/usersEmailConfirmation.repo';

export class RegistrationEmailResendingUseCaseCommand {
  constructor(public email: string) {}
}
@CommandHandler(RegistrationEmailResendingUseCaseCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingUseCaseCommand>
{
  constructor(
    private usersEmailConfirmationRepository: UsersEmailConfirmationRepo,
    private emailManager: EmailManager,
  ) {}
  async execute({
    email,
  }: RegistrationEmailResendingUseCaseCommand): Promise<CustomResponse<any>> {
    //get user email confirmation
    const userEmailConfirmationData: UserConfirmedStatusWithId | null =
      await this.usersEmailConfirmationRepository.getEmailConfirmedStatusWithId(
        email,
      );

    if (!userEmailConfirmationData)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        `User with ${email} don't exist`,
      );

    if (userEmailConfirmationData.isConfirmed)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        `Email has already confirmed!`,
      );
    //set new confirmation code and send it by email
    const confirmationCode = uuidv4();

    await this.usersEmailConfirmationRepository.setNewConfirmationCode(
      userEmailConfirmationData.id,
      confirmationCode,
    );

    await this.emailManager.sendConfirmationCode(email, confirmationCode);

    return new CustomResponse(true);
  }
}
