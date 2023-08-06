import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('UsersBanInfo')
export class UserBanInfo {
  @PrimaryColumn()
  userId: number;

  @Column()
  isBanned: boolean;

  @Column()
  banReason: string;

  @Column()
  banDate: Date;

  @OneToOne(() => User, (u) => u.userBanInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
