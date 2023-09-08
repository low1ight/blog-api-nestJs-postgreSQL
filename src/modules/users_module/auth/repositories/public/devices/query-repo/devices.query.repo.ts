import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceViewModel } from './dto/DeviceViewModel';
import { UserDevices } from '../../../../../users/entities/UserDevices.entity';

@Injectable()
export class DevicesQueryRepo {
  constructor(
    @InjectRepository(UserDevices)
    private readonly devicesRepository: Repository<UserDevices>,
  ) {}
  async getAllUsersByOwnerId(id: number) {
    const devices: UserDevices[] = await this.devicesRepository.find({
      where: {
        ownerId: id,
      },
    });

    return devices.map((device) => new DeviceViewModel(device));
  }
}
