import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizGameQuestion } from './QuizGameQuestion.entity';
import { User } from '../../../users_module/users/entities/User.entity';
import { QuizGamePlayerAnswer } from './QuizGamePlayerAnswer.entity';

@Entity('QuizGames')
export class QuizGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstPlayerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'firstPlayerId' }) // Указываем, какое поле является внешним ключом
  firstPlayer: User;

  @Column({ nullable: true })
  secondPlayerId: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'secondPlayerId' }) // Аналогично для второго игрока
  secondPlayer: User | null;

  @Column()
  status: string;

  @Column()
  pairCreatedDate: Date;

  @Column({ nullable: true })
  startGameDate: Date | null;

  @Column({ nullable: true })
  finishGameDate: Date | null;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => QuizGameQuestion, (q) => q.quizGame)
  questions: QuizGameQuestion[];

  @OneToMany(() => QuizGamePlayerAnswer, (q) => q.game)
  playerAnswers: QuizGamePlayerAnswer[];
}
