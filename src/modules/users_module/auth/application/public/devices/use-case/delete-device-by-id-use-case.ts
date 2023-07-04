import { DevicesPublicRepository } from '../../../../repositories/public/devices/devices.public.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomResponse } from '../../../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../../../utils/customResponse/CustomResponseEnum';
import { DeviceDbType } from '../../../../repositories/public/devices/dto/Device.db.type';

export class DeleteDeviceByIdUseCaseCommand {
  constructor(public deviceId: number, public currentUserId: number) {}
}
@CommandHandler(DeleteDeviceByIdUseCaseCommand)
export class DeleteDeviceByIdUseCase
  implements ICommandHandler<DeleteDeviceByIdUseCaseCommand>
{
  constructor(private readonly devicesRepository: DevicesPublicRepository) {}

  async execute({ deviceId, currentUserId }: DeleteDeviceByIdUseCaseCommand) {
    const device: DeviceDbType | null =
      await this.devicesRepository.getDeviceById(deviceId);

    if (!device) return new CustomResponse(false, CustomResponseEnum.notExist);
    if (device.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.devicesRepository.deleteDeviceById(deviceId);

    return new CustomResponse(true);
  }
}
