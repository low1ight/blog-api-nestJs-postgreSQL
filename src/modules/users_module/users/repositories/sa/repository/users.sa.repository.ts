import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDbModel } from '../../dto/User.db.model';
import { UserSaViewModel } from '../query-repository/dto/UserSaViewModel';
import { CreateUserDto } from '../../../controllers/sa/dto/CreateUserDto';
import { BanUserDto } from '../../../controllers/sa/dto/BanUserDto';

@Injectable()
export class UsersSaRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser({
    login,
    password,
    email,
  }: CreateUserDto): Promise<UserSaViewModel> {
    //create user
    const createdUserData: UserDbModel = await this.dataSource.query(
      `


        INSERT INTO public."Users"("login", "password", "passwordRecoveryCode", "email")
        VALUES($1, $2, null, $3)
        
        RETURNING "id","login","email","createdAt" ;
    `,
      [login, password, email],
    );

    //get created user from the arr
    const createdUser = createdUserData[0];
    //"id","login","email","createdAt"

    // creating a new userConfirmation entry for createdUser
    await this.dataSource.query(`
    
        INSERT INTO public."UsersEmailConfirmation"("ownerId", "confirmationCode", "expirationDate","isConfirmed")
        VALUES(${createdUser.id}, null,null,true);
    
    `);

    // creating a new UsersBanInfo entry for created User
    await this.dataSource.query(`
    
        INSERT INTO public."UsersBanInfo"("userId", "isBanned", "banReason", "banDate")
	      VALUES (${createdUser.id}, false, null, null);
    
    `);

    return new UserSaViewModel({
      ...createdUser,
      isBanned: false,
      banDate: null,
      banReason: null,
    });
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
}