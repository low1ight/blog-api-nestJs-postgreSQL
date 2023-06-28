import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExpirationDate } from '../../../../../../utils/expirationDate';

@Injectable()
export class UsersEmailConfirmationRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createAutoConfirmedEmailConfirmationFofUser(userId: number) {
    await this.dataSource.query(
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
  ) {
    const expirationDate = ExpirationDate.createDateForEmailConfirmation(
      new Date(),
    );
    await this.dataSource.query(
      `
    
        INSERT INTO public."UsersEmailConfirmation"("ownerId", "confirmationCode", "expirationDate","isConfirmed")
        VALUES($1, $2, $3, false);
    
    `,
      [userId, confirmationCode, expirationDate],
    );
  }
}
