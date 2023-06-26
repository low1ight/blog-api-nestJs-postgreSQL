import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthMeViewModel } from './dto/AuthMeViewModel';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getUserDataForAuthMe(id): Promise<AuthMeViewModel> {
    const userData: AuthMeViewModel[] = await this.dataSource.query(
      `
    
    SELECT "email","login","id" as "userId"
    FROM "Users"    
    WHERE "id" = $1
    
    `,
      [id],
    );

    return userData[0];
  }
}
