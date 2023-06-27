import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceDbType } from './dto/Device.db.type';

@Injectable()
export class DevicesPublicRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createDevice(
    ownerId: number,
    ip: string,
    title: string,
    sessionId: string,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `
    INSERT INTO public."UsersDevices"(
     "ownerId", ip, title, "lastActiveDate", "sessionId")
      VALUES ($1, $2, $3, now(), $4)
      
      RETURNING id;
      
    `,
      [ownerId, ip, title, sessionId],
    );

    return result[0].id;
  }

  async deleteAllDevicesExceptCurrentDeviceId(
    ownerId: number,
    currentDeviceId: number,
  ) {
    return await this.dataSource.query(
      `
    DELETE FROM "UsersDevices" 
    WHERE "ownerId" = $1 AND NOT "id" = $2
    
    `,
      [ownerId, currentDeviceId],
    );
  }

  async deleteDeviceById(deviceId: number) {
    return await this.dataSource.query(
      `
    
    DELETE FROM "UsersDevices"  WHERE "id" = $1
    
    `,
      [deviceId],
    );
  }

  async getDeviceById(deviceId: number): Promise<DeviceDbType | null> {
    const device = await this.dataSource.query(
      `
    
    SELECT * FROM "UsersDevices" 
    WHERE "id" = $1
    
    
    `,
      [deviceId],
    );

    return device[0] || null;
  }

  async updateSessionId(sessionId: string, deviceId: number) {
    await this.dataSource.query(
      `
    
    UPDATE public."UsersDevices"
    SET "lastActiveDate"=now(), "sessionId"=$1
    WHERE id=$2;
    
    
    `,
      [sessionId, deviceId],
    );
  }
}
