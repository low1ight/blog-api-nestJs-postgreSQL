import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDbModel } from '../../../dto/User.db.model';
import { UserSaViewModel } from '../../query-repository/dto/UserSaViewModel';
import { CreateUserDto } from '../../../../controllers/sa/dto/CreateUserDto';

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
    
        INSERT INTO public."UsersEmailConfirmation"("ownerId", "confirmationCode", "expirationDate")
        VALUES(${createdUser.id}, 'auto-confirmed', now());
    
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

  async checkIsUserExistByField(
    findBy: string,
    findStr: string,
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
}
