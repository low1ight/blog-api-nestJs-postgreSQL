import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesPublicRepository } from '../../../../repositories/public/devices/devices.public.repository';

export class LogoutUseCaseCommand {
  constructor(public deviceId: number) {}
}
@CommandHandler(LogoutUseCaseCommand)
export class LogoutUseCase implements ICommandHandler<LogoutUseCaseCommand> {
  constructor(private readonly devicesRepository: DevicesPublicRepository) {}
  async execute({ deviceId }: LogoutUseCaseCommand) {
    await this.devicesRepository.deleteDeviceById(deviceId);
  }
}
