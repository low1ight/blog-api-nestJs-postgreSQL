import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersBanInfoRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUserBanInfo(userId: number, queryRunner: QueryRunner) {
    await queryRunner.query(
      `
    
        INSERT INTO public."UsersBanInfo"("userId")
	      VALUES ($1);
    
    `,
      [userId],
    );
  }

  async setBanStatusForUser(
    userId: number,
    isBanned: boolean,
    banReason: string | null,
    banDate: Date | null,
  ) {
    await this.dataSource.query(
      `
    
       UPDATE public."UsersBanInfo"
       SET "isBanned"=$2, "banReason"=$3, "banDate"=$4
       WHERE "userId" = $1;
    
    
    
    `,
      [userId, isBanned, banReason, banDate],
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
