import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserBanInfo } from './UserBanInfo.entity';

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
  userBanInfo: () => UserBanInfo;
}
