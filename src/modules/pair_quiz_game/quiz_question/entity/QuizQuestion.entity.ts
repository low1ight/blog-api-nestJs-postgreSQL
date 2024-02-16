import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizGameQuestion } from '../../quiz_game/entity/QuizGameQuestion.entity';

@Entity('QuizQuestions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column('json')
  correctAnswers: any[];

  @Column()
  published: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => QuizGameQuestion, (gq) => gq.question)
  gameQuestion: QuizGameQuestion[];
}
