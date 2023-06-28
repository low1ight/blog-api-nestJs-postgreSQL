import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async deleteAllData() {
    await this.dataSource.query(`
        
          DELETE FROM "UsersBanInfo";
          DELETE FROM "UsersEmailConfirmation";
          DELETE FROM "UsersDevices";
          DELETE FROM "Users";
    

    `);
  }
}
