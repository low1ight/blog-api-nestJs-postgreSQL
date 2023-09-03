import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserForLoginValidationModel } from '../dto/UserForLoginValidationModel';
import { CreateUserDto } from '../../controllers/dto/CreateUserDto';
import { User } from '../../entities/User.entity';

@Injectable()
export class UsersRepo {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createUser(
    { login, password, email }: CreateUserDto,
    queryRunner: QueryRunner,
  ): Promise<number> {
    const user = new User();

    user.login = login;
    user.password = password;
    user.email = email;

    const createdUserData = await queryRunner.manager.save(user);

    console.log(createdUserData);

    return createdUserData.id;
  }

  async deleteUserById(id: number) {
    // await this.dataSource.query(`DELETE FROM "Users" WHERE id = $1`, [id]);
    await this.userRepository.delete({ id: id });
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

  async isUserExist(userId: number) {
    const result = await this.dataSource.query(
      `
    
         SELECT Count(*)
         FROM "Users" 
         WHERE "id" = $1
    
    `,
      [userId],
    );

    return result[0].count === '1';
  }
}
