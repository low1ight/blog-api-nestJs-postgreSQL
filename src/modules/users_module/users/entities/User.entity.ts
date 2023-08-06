import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBanInfo } from './UserBanInfo.entity';
import { UserDevices } from './UserDevices.entity';
import { UserEmailConfirmation } from './UserEmailConfirmation.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  passwordRecoveryCode: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UserBanInfo, (b) => b.user)
  userBanInfo: UserBanInfo;

  @OneToOne(() => UserEmailConfirmation, (e) => e.user)
  userEmailConfirmation: UserBanInfo;

  @OneToMany(() => UserDevices, (d) => d.user)
  userDevices: UserDevices[];
}
