import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('UsersDevices')
export class UserDevices {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  ownerId: number;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column()
  lastActiveDate: Date;

  @Column()
  sessionId: string;

  @ManyToOne(() => User, (u) => u.userDevices, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
