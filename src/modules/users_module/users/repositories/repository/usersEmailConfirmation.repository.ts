import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { ExpirationDate } from '../../../../../utils/expirationDate';
import { UsersEmailConfirmationDbModel } from '../dto/UsersEmailConfirmation.db.model';

@Injectable()
export class UsersEmailConfirmationRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createAutoConfirmedEmailConfirmationFofUser(
    userId: number,
    queryRunner: QueryRunner,
  ) {
    await queryRunner.query(
      `
    
        INSERT INTO public."UsersEmailConfirmation"("ownerId", "confirmationCode", "expirationDate","isConfirmed")
        VALUES($1, null, null, true);
    
    `,
      [userId],
    );
  }
  async createUnconfirmedEmailConfirmationFofUser(
    userId: number,
    confirmationCode: string,
    queryRunner: QueryRunner,
  ) {
    const expirationDate = ExpirationDate.createDateForEmailConfirmation(
      new Date(),
    );
    await queryRunner.query(
      `
    
        INSERT INTO public."UsersEmailConfirmation"("ownerId", "confirmationCode", "expirationDate","isConfirmed")
        VALUES($1, $2, $3, false);
    
    `,
      [userId, confirmationCode, expirationDate],
    );
  }

  async getUserConfirmationDataByCode(
    code: string,
  ): Promise<UsersEmailConfirmationDbModel | null> {
    const result = await this.dataSource.query(
      `
    
    SELECT * FROM "UsersEmailConfirmation"
    WHERE "confirmationCode" = $1
    
    
    `,
      [code],
    );

    return result[0] || null;
  }

  async confirmEmail(userId: number) {
    await this.dataSource.query(
      `
    UPDATE public."UsersEmailConfirmation"
    SET "isConfirmed"=true
    WHERE "ownerId" = $1`,
      [userId],
    );
  }

  async getEmailConfirmedStatusWithId(email: string) {
    const result = await this.dataSource.query(
      `
    
    SELECT u."id", e."isConfirmed"
    FROM "Users" u 
    LEFT JOIN "UsersEmailConfirmation" e ON u."id" = e."ownerId"
    WHERE "email" = $1
    
    
    `,
      [email],
    );

    return result[0] || null;
  }

  async setNewConfirmationCode(userId: number, code: string) {
    await this.dataSource.query(
      `
    
    UPDATE public."UsersEmailConfirmation"
    SET  "confirmationCode"=$2
    WHERE "ownerId" = $1;
    
    `,
      [userId, code],
    );
  }
}
