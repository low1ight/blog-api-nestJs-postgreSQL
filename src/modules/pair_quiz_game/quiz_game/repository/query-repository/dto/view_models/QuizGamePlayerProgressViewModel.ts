import { QuizGamePlayerProgressAnswerViewModel } from './QuizGamePlayerProgressAnswerViewModel';
import { PlayerDBType } from '../PlayerDBType';
import { PlayerAnswerDbModel } from '../PlayerAnswerDbModel';
import { QuizGamePlayerAnswerViewModel } from './QuizGamePlayerAnswerViewModel';

export class QuizGamePlayerProgressViewModel {
  answers: QuizGamePlayerProgressAnswerViewModel[];
  player: {
    id: string;
    login: string;
  };
  score: number;

  constructor(
    { id, login }: PlayerDBType,
    answers: QuizGamePlayerAnswerViewModel[],
  ) {
    this.answers = answers;
    this.player = {
      id: id.toString(),
      login,
    };
    this.score = answers.reduce((acc, cur) => {
      if (cur.answerStatus === 'Correct') acc++;
      return acc;
    }, 0);
  }
}
