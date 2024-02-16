import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuizGame } from './QuizGame.entity';
import { QuizQuestion } from '../../quiz_question/entity/QuizQuestion.entity';

@Entity('QuizGamesQuestions')
export class QuizGameQuestion {
  @PrimaryColumn()
  quizGameId: string;

  @PrimaryColumn()
  quizQuestionId: string;

  @ManyToOne(() => QuizGame, (g) => g.questions)
  quizGame: QuizGame;

  @ManyToOne(() => QuizQuestion, (g) => g.gameQuestion)
  question: QuizQuestion;
}
