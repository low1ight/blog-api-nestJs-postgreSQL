import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QuizQuestions')
export class QuizQuestions {
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
}
