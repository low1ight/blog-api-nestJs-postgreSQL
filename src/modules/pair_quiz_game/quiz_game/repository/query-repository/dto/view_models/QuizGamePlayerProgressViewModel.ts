import { QuizGamePlayerProgressAnswerViewModel } from './QuizGamePlayerProgressAnswerViewModel';
import { PlayerDBType } from '../PlayerDBType';

export class QuizGamePlayerProgressViewModel {
  answers: QuizGamePlayerProgressAnswerViewModel[];
  player: {
    id: string;
    login: string;
  };
  score: number;

  constructor({ id, login }: PlayerDBType) {
    this.answers = [];
    this.player = {
      id: id.toString(),
      login,
    };
    this.score = 0;
  }
}
