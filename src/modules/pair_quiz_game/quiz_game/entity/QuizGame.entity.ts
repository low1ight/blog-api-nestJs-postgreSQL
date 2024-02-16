import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizGameQuestion } from './QuizGameQuestion.entity';

@Entity('QuizGames')
export class QuizGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstPlayerId: number;

  @Column({ nullable: true })
  secondPlayerId: number | null;

  @Column()
  status: string;

  @Column()
  pairCreatedDate: Date;

  @Column({ nullable: true })
  startGameDate: Date | null;

  @Column({ nullable: true })
  finishGameDate: Date | null;

  @OneToMany(() => QuizGameQuestion, (q) => q.quizGame)
  questions: QuizGameQuestion[];
}
