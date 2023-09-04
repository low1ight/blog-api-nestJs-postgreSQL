import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserBanInfo } from '../../entities/UserBanInfo.entity';
@Injectable()
export class UsersBanInfoRepo {
  constructor(
    @InjectRepository(UserBanInfo)
    protected userBanInfoRepository: Repository<UserBanInfo>,
  ) {}

  async createUserBanInfo(userId: number, queryRunner: QueryRunner) {
    const userBanInfo = new UserBanInfo();
    userBanInfo.userId = userId;
    await queryRunner.manager.save(userBanInfo);
  }

  async setBanStatusForUser(
    userId: number,
    isBanned: boolean,
    banReason: string | null,
    banDate: Date | null,
  ) {
    const userBanInfo = await this.userBanInfoRepository.findOneBy({ userId });

    userBanInfo.isBanned = isBanned;
    userBanInfo.banReason = banReason;
    userBanInfo.banDate = banDate;

    await this.userBanInfoRepository.save(userBanInfo);
  }

  async getUserBanStatusById(userId: number) {
    const user = await this.userBanInfoRepository.findOneBy({ userId });

    return user || null;
  }
}
