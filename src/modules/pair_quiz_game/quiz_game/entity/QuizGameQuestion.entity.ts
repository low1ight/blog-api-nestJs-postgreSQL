import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuizGame } from './QuizGame.entity';
import { QuizQuestion } from '../../quiz_question/entity/QuizQuestion.entity';

@Entity('QuizGamesQuestions')
export class QuizGameQuestion {
  @PrimaryColumn()
  quizGameId: string;

  @PrimaryColumn()
  questionId: string;

  @ManyToOne(() => QuizGame, (g) => g.questions)
  quizGame: QuizGame;

  @ManyToOne(() => QuizQuestion, (q) => q.gameQuestion)
  question: QuizQuestion;

  @Column()
  questionNumber: number;
}
