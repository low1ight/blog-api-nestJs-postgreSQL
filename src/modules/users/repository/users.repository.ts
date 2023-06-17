import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser() {
    return this.dataSource.query(`

     INSERT INTO public."Users"("name","description","websiteUrl","isMembership")
     VALUES('testName','dest','test', false)
  
    `);
  }
}
