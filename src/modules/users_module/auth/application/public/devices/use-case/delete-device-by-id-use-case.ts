import { DeviceRepo } from '../../../../repositories/public/devices/device.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomResponse } from '../../../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../../../utils/customResponse/CustomResponseEnum';
import { UserDevices } from '../../../../../users/entities/UserDevices.entity';

export class DeleteDeviceByIdUseCaseCommand {
  constructor(public deviceId: number, public currentUserId: number) {}
}
@CommandHandler(DeleteDeviceByIdUseCaseCommand)
export class DeleteDeviceByIdUseCase
  implements ICommandHandler<DeleteDeviceByIdUseCaseCommand>
{
  constructor(private readonly devicesRepository: DeviceRepo) {}

  async execute({ deviceId, currentUserId }: DeleteDeviceByIdUseCaseCommand) {
    const device: UserDevices | null =
      await this.devicesRepository.getDeviceById(deviceId);

    if (!device) return new CustomResponse(false, CustomResponseEnum.notExist);
    if (device.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.devicesRepository.deleteDeviceById(deviceId);

    return new CustomResponse(true);
  }
}
