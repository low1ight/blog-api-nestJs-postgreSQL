import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceDbType } from '../dto/Device.db.type';
import { DeviceViewModel } from './dto/DeviceViewModel';

@Injectable()
export class DevicesPublicQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getAllUsersByOwnerId(id: number) {
    const devices: DeviceDbType[] = await this.dataSource.query(
      `
    
    SELECT "ip","title","lastActiveDate","id" 
    FROM "UsersDevices" WHERE "ownerId" = $1
    `,
      [id],
    );

    return devices.map((device) => new DeviceViewModel(device));
  }
}
