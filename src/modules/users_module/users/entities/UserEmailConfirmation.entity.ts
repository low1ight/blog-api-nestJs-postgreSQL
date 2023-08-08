import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('UsersEmailConfirmation')
export class UserEmailConfirmation {
  @PrimaryColumn()
  ownerId: number;

  @Column({ nullable: true })
  confirmationCode: string;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column()
  isConfirmed: boolean;

  @OneToOne(() => User, (u) => u.userEmailConfirmation, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
