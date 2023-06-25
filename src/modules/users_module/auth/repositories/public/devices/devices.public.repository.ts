import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
    WHERE "ownerId" = ownerId AND NOT "id" = currentDeviceId
    
    `,
      [ownerId, currentDeviceId],
    );
  }
}
