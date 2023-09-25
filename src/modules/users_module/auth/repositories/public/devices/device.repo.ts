import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserDevices } from '../../../../users/entities/UserDevices.entity';

@Injectable()
export class DeviceRepo {
  constructor(
    @InjectRepository(UserDevices)
    protected deviceRepository: Repository<UserDevices>,
  ) {}
  async createDevice(
    ownerId: number,
    ip: string,
    title: string,
    sessionId: string,
  ): Promise<number> {
    const device = new UserDevices();
    device.ownerId = ownerId;
    device.ip = ip;
    device.sessionId = sessionId;
    device.title = title;
    device.lastActiveDate = new Date();

    const createdDevice = await this.deviceRepository.save(device);

    return createdDevice.id;
  }

  async deleteAllDevicesExceptCurrentDeviceId(
    ownerId: number,
    currentDeviceId: number,
  ) {
    await this.deviceRepository.delete({ ownerId, id: Not(currentDeviceId) });
    // return await this.dataSource.query(
    //   `
    // DELETE FROM "UsersDevices"
    // WHERE "ownerId" = $1 AND NOT "id" = $2
    //
    // `,
    //   [ownerId, currentDeviceId],
    // );
  }

  async deleteDeviceById(deviceId: number) {
    await this.deviceRepository.delete({ id: deviceId });

    // return await this.dataSource.query(
    //   `
    //
    // DELETE FROM "UsersDevices"  WHERE "id" = $1
    //
    // `,
    //   [deviceId],
    // );
  }

  async getDeviceById(deviceId: number) {
    return await this.deviceRepository.findOneBy({ id: deviceId });
    // const device = await this.dataSource.query(
    //   `
    //
    // SELECT * FROM "UsersDevices"
    // WHERE "id" = $1
    //
    //
    // `,
    //   [deviceId],
    // );
    // return device[0] || null;
  }

  async updateSessionId(sessionId: string, deviceId: number) {
    const device = await this.deviceRepository.findOneBy({ id: deviceId });

    device.sessionId = sessionId;
    device.lastActiveDate = new Date();

    await this.deviceRepository.save(device);
    // await this.dataSource.query(
    //   `
    //
    // UPDATE public."UsersDevices"
    // SET "lastActiveDate"=now(), "sessionId"=$1
    // WHERE id=$2;
    //
    //
    // `,
    //   [sessionId, deviceId],
    // );
  }
}
