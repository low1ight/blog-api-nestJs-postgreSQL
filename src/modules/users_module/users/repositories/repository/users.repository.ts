import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserForLoginValidationModel } from '../dto/UserForLoginValidationModel';
import { CreateUserDto } from '../../controllers/dto/CreateUserDto';
import { UserDbModel } from '../dto/User.db.model';
import { BanUserDto } from '../../controllers/dto/BanUserDto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser({ login, password, email }: CreateUserDto): Promise<number> {
    //create user
    const createdUserData: UserDbModel = await this.dataSource.query(
      `


        INSERT INTO public."Users"("login", "password", "passwordRecoveryCode", "email")
        VALUES($1, $2, null, $3)
        
        RETURNING "id","login","email","createdAt" ;
    `,
      [login, password, email],
    );

    //return created user id
    return createdUserData[0].id;
  }

  async deleteUserById(id: number) {
    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        `DELETE FROM "UsersEmailConfirmation" WHERE "ownerId" = $1`,
        [id],
      );
      await manager.query(` DELETE FROM "UsersBanInfo" WHERE "userId" = $1`, [
        id,
      ]);
      await manager.query(`DELETE FROM "Users" WHERE id = $1`, [id]);
    });
  }

  async setBanStatusForUser(userId: number, dto: BanUserDto) {
    await this.dataSource.query(
      `
    
       UPDATE public."UsersBanInfo"
       SET "isBanned"=$2, "banReason"=$3, "banDate"=CURRENT_DATE
       WHERE "userId" = $1;
    
    
    
    `,
      [userId, dto.isBanned, dto.banReason],
    );
  }

  async checkIsUserExistByField(
    findBy: string,
    findStr: string | number,
  ): Promise<boolean> {
    //should return 1 if user exist
    const isExist = await this.dataSource.query(
      `
    SELECT COUNT(1) FROM "Users" WHERE ${findBy} = $1
    `,

      [findStr],
    );

    //transform result to boolean and return

    return !!Number(isExist[0].count);
  }

  async getUserDataForLogin(
    loginOrEmail: string,
  ): Promise<UserForLoginValidationModel | null> {
    const result = await this.dataSource.query(
      `
    SELECT u."id",
           "login",
           "email",
           "password",
           c."isConfirmed",
           b."isBanned"  
                
  FROM "Users" u          
 LEFT JOIN "UsersEmailConfirmation" c ON u."id" = c."ownerId"
 LEFT JOIN "UsersBanInfo" b ON u."id" = b."userId"
 WHERE "email" = $1 OR "login" = $1
    
    `,
      [loginOrEmail],
    );

    return result[0] || null;
  }

  async getUserIdByEmail(email: string): Promise<number | null> {
    const userData = await this.dataSource.query(
      ` 
    SELECT "id" 
    FROM "Users"
    WHERE "email" = $1  
    `,
      [email],
    );

    return userData[0]?.id || null;
  }

  async updatePasswordRecoveryCode(userId: number, recoveryCode: string) {
    await this.dataSource.query(
      `
   UPDATE public."Users"
   SET "passwordRecoveryCode" = $2
   WHERE "id" = $1;
    `,
      [userId, recoveryCode],
    );
  }

  async setNewPassword(userId: number, password: string) {
    await this.dataSource.query(
      `
   UPDATE public."Users"
   SET "password" = $2
   WHERE "id" = $1;
    `,
      [userId, password],
    );
  }

  async getUserIdByPasswordRecoveryCode(code: string): Promise<number | null> {
    const result = await this.dataSource.query(
      `
    
    SELECT "id"
    FROM "Users"
    WHERE "passwordRecoveryCode" = $1
    
    `,
      [code],
    );
    return result[0]?.id || null;
  }
}
