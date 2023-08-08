import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('UsersBanInfo')
export class UserBanInfo {
  @PrimaryColumn()
  userId: number;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true, default: null })
  banReason: string;

  @Column({ nullable: true, default: null })
  banDate: Date;

  @OneToOne(() => User, (u) => u.userBanInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
