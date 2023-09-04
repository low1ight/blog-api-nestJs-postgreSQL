import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ExpirationDate } from '../../../../../utils/expirationDate';
import { UsersEmailConfirmationDbModel } from '../dto/UsersEmailConfirmation.db.model';
import { UserEmailConfirmation } from '../../entities/UserEmailConfirmation.entity';

@Injectable()
export class UsersEmailConfirmationRepo {
  constructor(
    @InjectRepository(UserEmailConfirmation)
    protected userEmailConfirmationRepository: Repository<UserEmailConfirmation>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createAutoConfirmedEmailConfirmationFofUser(
    userId: number,
    queryRunner: QueryRunner,
  ) {
    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.ownerId = userId;
    userEmailConfirmation.confirmationCode = null;
    userEmailConfirmation.expirationDate = null;
    userEmailConfirmation.isConfirmed = true;

    await queryRunner.manager.save(userEmailConfirmation);
  }
  async createUnconfirmedEmailConfirmationFofUser(
    userId: number,
    confirmationCode: string,
    queryRunner: QueryRunner,
  ) {
    const expirationDate = ExpirationDate.createDateForEmailConfirmation(
      new Date(),
    );

    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.ownerId = userId;
    userEmailConfirmation.confirmationCode = confirmationCode;
    userEmailConfirmation.expirationDate = expirationDate;
    userEmailConfirmation.isConfirmed = false;

    await queryRunner.manager.save(userEmailConfirmation);
  }

  async getUserConfirmationDataByCode(
    code: string,
  ): Promise<UsersEmailConfirmationDbModel | null> {
    const user = await this.userEmailConfirmationRepository.findOneBy({
      confirmationCode: code,
    });

    return user || null;
  }

  async confirmEmail(userId: number) {
    const user = await this.userEmailConfirmationRepository.findOneBy({
      ownerId: userId,
    });

    user.isConfirmed = true;

    await this.userEmailConfirmationRepository.save(user);
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
    const userConfirmation =
      await this.userEmailConfirmationRepository.findOneBy({ ownerId: userId });

    userConfirmation.confirmationCode = code;
    await this.userEmailConfirmationRepository.save(userConfirmation);
  }
}
