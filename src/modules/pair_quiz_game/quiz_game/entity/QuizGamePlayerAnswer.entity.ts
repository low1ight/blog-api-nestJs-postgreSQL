import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../users_module/users/entities/User.entity';
import { QuizQuestion } from '../../quiz_question/entity/QuizQuestion.entity';
import { QuizGame } from './QuizGame.entity';

@Entity('QuizGamePlayersAnswers')
export class QuizGamePlayerAnswer {
  @PrimaryColumn()
  questionId: string;

  @ManyToOne(() => QuizQuestion)
  @JoinColumn({ name: 'questionId' })
  question: QuizQuestion;

  @PrimaryColumn()
  gameId: string;

  @ManyToOne(() => QuizGame)
  @JoinColumn({ name: 'gameId' })
  game: QuizGame;

  @PrimaryColumn()
  playerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'playerId' })
  player: User;

  @Column()
  questionAnswer: string;

  @Column()
  addedAt: Date;
}
