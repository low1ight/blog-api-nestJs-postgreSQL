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

    return createdUserData.id;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete({ id: id });
  }

  async checkIsUserExistByField(
    findBy: string,
    findStr: string | number,
  ): Promise<boolean> {
    //should return 1 if user exist
    const count = await this.userRepository.count({
      where: {
        [findBy]: findStr,
      },
    });

    return count > 0;
  }

  async getUserDataForLogin(
    loginOrEmail: string,
  ): Promise<UserForLoginValidationModel | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.login = :login', { login: loginOrEmail })
      .orWhere('user.email = :email', { email: loginOrEmail })
      .leftJoinAndSelect('user.userBanInfo', 'banInfo')
      .leftJoinAndSelect('user.userEmailConfirmation', 'emailConfirmation')
      .getOne();
  }

  async getUserIdByEmail(email: string): Promise<number | null> {
    const user = await this.userRepository.findOneBy({ email });

    return user.id || null;
  }

  async updatePasswordRecoveryCode(userId: number, recoveryCode: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    user.passwordRecoveryCode = recoveryCode;

    await this.userRepository.save(user);
  }

  async setNewPassword(userId: number, password: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    user.password = password;

    await this.userRepository.save(user);
  }

  async getUserIdByPasswordRecoveryCode(code: string): Promise<number | null> {
    const user = await this.userRepository.findOneBy({
      passwordRecoveryCode: code,
    });

    return user.id || null;
  }

  async isUserExist(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    return !!user;
  }
}
