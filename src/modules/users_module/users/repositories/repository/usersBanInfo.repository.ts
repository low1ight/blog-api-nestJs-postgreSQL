import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersBanInfoRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUserBanInfo(userId: number, queryRunner: QueryRunner) {
    await queryRunner.query(
      `
    
        INSERT INTO public."UsersBanInfo"("userId", "isBanned", "banReason", "banDate")
	      VALUES ($1, false, null, null);
    
    `,
      [userId],
    );
  }

  async getUserBanStatusById(userId: number) {
    const result = await this.dataSource.query(
      `
    SELECT "isBanned" 
    FROM "UsersBanInfo"
    WHERE "userId" = $1
    
    `,
      [userId],
    );

    return result[0] || null;
  }
}
