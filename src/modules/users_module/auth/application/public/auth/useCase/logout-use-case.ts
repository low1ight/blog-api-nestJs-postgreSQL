import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepo } from '../../../../repositories/public/devices/device.repo';

export class LogoutUseCaseCommand {
  constructor(public deviceId: number) {}
}
@CommandHandler(LogoutUseCaseCommand)
export class LogoutUseCase implements ICommandHandler<LogoutUseCaseCommand> {
  constructor(private readonly devicesRepository: DeviceRepo) {}
  async execute({ deviceId }: LogoutUseCaseCommand) {
    await this.devicesRepository.deleteDeviceById(deviceId);
  }
}
