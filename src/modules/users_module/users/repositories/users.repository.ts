import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
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
}
