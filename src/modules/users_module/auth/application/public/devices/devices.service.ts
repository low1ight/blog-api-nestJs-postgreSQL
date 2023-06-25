import { Injectable } from '@nestjs/common';
import { DevicesPublicRepository } from '../../../repositories/public/devices/devices.public.repository';
import { DeviceDbType } from '../../../repositories/public/devices/dto/Device.db.type';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesPublicRepository) {}
  async isSessionIdForDeviceValid(
    deviceId: number,
    sessionId: string,
  ): Promise<boolean> {
    const device: DeviceDbType | null =
      await this.devicesRepository.getDeviceById(deviceId);

    if (!device) return false;

    return device.sessionId === sessionId;
  }
}
