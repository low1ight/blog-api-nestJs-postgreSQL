import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesPublicQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getAllUsersByOwnerId(id: number) {
    return await this.dataSource.query(
      `
    
    SELECT "ip","title","lastActiveDate","id" as "deviceId"  
    FROM "UsersDevices" WHERE "ownerId" = $1
    
    `,
      [id],
    );
  }
}
