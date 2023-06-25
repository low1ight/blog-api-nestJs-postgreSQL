import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesPublicRepository } from '../../../../repositories/public/devices/devices.public.repository';

export class DeleteAllOtherDevicesCommand {
  constructor(public ownerId: number, public currentDeviceId: number) {}
}

@CommandHandler(DeleteAllOtherDevicesCommand)
export class DeleteAllOtherDevices
  implements ICommandHandler<DeleteAllOtherDevicesCommand>
{
  constructor(private readonly devicesRepository: DevicesPublicRepository) {}
  async execute({ ownerId, currentDeviceId }: DeleteAllOtherDevicesCommand) {
    return await this.devicesRepository.deleteAllDevicesExceptCurrentDeviceId(
      ownerId,
      currentDeviceId,
    );
  }
}
