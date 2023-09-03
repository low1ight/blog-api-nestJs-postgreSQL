import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepo } from '../../../../repositories/public/devices/device.repo';

export class DeleteAllOtherDevicesUseCaseCommand {
  constructor(public ownerId: number, public currentDeviceId: number) {}
}

@CommandHandler(DeleteAllOtherDevicesUseCaseCommand)
export class DeleteAllOtherDevicesUseCase
  implements ICommandHandler<DeleteAllOtherDevicesUseCaseCommand>
{
  constructor(private readonly devicesRepository: DeviceRepo) {}
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
