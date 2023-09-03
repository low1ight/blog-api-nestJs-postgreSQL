import { Injectable } from '@nestjs/common';
import { DeviceRepo } from '../../../repositories/public/devices/device.repo';
import { UserDevices } from '../../../../users/entities/UserDevices.entity';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DeviceRepo) {}
  async isSessionIdForDeviceValid(
    deviceId: number,
    sessionId: string,
  ): Promise<boolean> {
    const device: UserDevices | null =
      await this.devicesRepository.getDeviceById(deviceId);

    if (!device) return false;

    return device.sessionId === sessionId;
  }
}
