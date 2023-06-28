import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersBanInfoRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUserBanInfo(userId: number) {
    await this.dataSource.query(
      `
    
        INSERT INTO public."UsersBanInfo"("userId", "isBanned", "banReason", "banDate")
	      VALUES ($1, false, null, null);
    
    `,
      [userId],
    );
  }
}
