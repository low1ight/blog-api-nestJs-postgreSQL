import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersEmailConfirmationDbModel } from '../../../../../users/repositories/dto/UsersEmailConfirmation.db.model';
import { UsersEmailConfirmationRepo } from '../../../../../users/repositories/repository/usersEmailConfirmation.repo';
import { CustomResponse } from '../../../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../../../utils/customResponse/CustomResponseEnum';

export class EmailConfirmationUseCaseCommand {
  constructor(public confirmationCode: string) {}
}
@CommandHandler(EmailConfirmationUseCaseCommand)
export class EmailConfirmationUseCase
  implements ICommandHandler<EmailConfirmationUseCaseCommand>
{
  constructor(
    private readonly usersEmailConfirmationRepository: UsersEmailConfirmationRepo,
  ) {}

  async execute({ confirmationCode }: EmailConfirmationUseCaseCommand) {
    const userEmailConfirmationData: UsersEmailConfirmationDbModel =
      await this.usersEmailConfirmationRepository.getUserConfirmationDataByCode(
        confirmationCode,
      );

    if (!userEmailConfirmationData)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'confirmation code is incorrect',
      );

    if (userEmailConfirmationData.isConfirmed)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'confirmation has already been applied',
      );

    if (userEmailConfirmationData.expirationDate < new Date())
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'confirmation code has been expired',
      );

    await this.usersEmailConfirmationRepository.confirmEmail(
      userEmailConfirmationData.ownerId,
    );

    return new CustomResponse(true);
  }
}
