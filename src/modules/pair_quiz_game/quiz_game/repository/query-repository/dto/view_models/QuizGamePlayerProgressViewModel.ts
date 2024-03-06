import { QuizGamePlayerProgressAnswerViewModel } from './QuizGamePlayerProgressAnswerViewModel';
import { PlayerDBType } from '../PlayerDBType';
import { PlayerAnswerDbModel } from '../PlayerAnswerDbModel';
import { QuizGamePlayerAnswerViewModel } from './QuizGamePlayerAnswerViewModel';
import { QuestionDBType } from '../QuizGameDBType';

export class QuizGamePlayerProgressViewModel {
  answers: QuizGamePlayerProgressAnswerViewModel[];
  player: {
    id: string;
    login: string;
  };
  score: number;

  constructor(
    { id, login }: PlayerDBType,
    answers: PlayerAnswerDbModel[],
    questions:QuestionDBType[]

  ) {
    this.answers = answers
      .filter((i) => i.playerId === id)
      .map(
        (question, index) =>
          new QuizGamePlayerAnswerViewModel(
            question,
            questions[index].question.correctAnswers,
          ),
      )
    this.player = {
      id: id.toString(),
      login,
    };
    this.score = this.answers.reduce((acc, cur) => {
      if (cur.answerStatus === 'Correct') acc++;
      return acc;
    }, 0);
  }
}
