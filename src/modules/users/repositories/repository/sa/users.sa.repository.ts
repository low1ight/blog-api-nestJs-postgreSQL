import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDbModel } from '../../dto/User.db.model';

@Injectable()
export class UsersSaRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser({
    login,
    password,
    email,
  }: {
    login: string;
    password: string;
    email: string;
  }): Promise<UserDbModel> {
    //create user
    const createdUserData: UserDbModel = await this.dataSource.query(
      `


        INSERT INTO public."Users"("login", "password", "passwordRecoveryCode", "email")
        VALUES($1, $2, null, $3)
        
        RETURNING * ;
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

    return createdUser;
  }
}
