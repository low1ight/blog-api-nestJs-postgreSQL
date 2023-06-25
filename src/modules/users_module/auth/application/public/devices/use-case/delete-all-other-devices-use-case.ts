import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesPublicRepository } from '../../../../repositories/public/devices/devices.public.repository';

export class DeleteAllOtherDevicesUseCaseCommand {
  constructor(public ownerId: number, public currentDeviceId: number) {}
}

@CommandHandler(DeleteAllOtherDevicesUseCaseCommand)
export class DeleteAllOtherDevicesUseCase
  implements ICommandHandler<DeleteAllOtherDevicesUseCaseCommand>
{
  constructor(private readonly devicesRepository: DevicesPublicRepository) {}
  async execute({
    ownerId,
    currentDeviceId,
  }: DeleteAllOtherDevicesUseCaseCommand) {
    return await this.devicesRepository.deleteAllDevicesExceptCurrentDeviceId(
      ownerId,
      currentDeviceId,
    );
  }
}
