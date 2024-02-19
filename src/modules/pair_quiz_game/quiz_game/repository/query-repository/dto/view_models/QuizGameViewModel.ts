import { QuizGameDBType } from '../QuizGameDBType';
import { QuizGamePlayerProgressViewModel } from './QuizGamePlayerProgressViewModel';
import { QuizGameQuestionViewModel } from './QuizGameQuestionViewModel';

export class QuizGameViewModel {
  id: string;
  firstPlayerProgress: QuizGamePlayerProgressViewModel;
  secondPlayerProgress: QuizGamePlayerProgressViewModel | null;
  questions: QuizGameQuestionViewModel[];
  status: string;
  pairCreatedDate: Date;
  startGameDate: Date;
  finishGameDate: Date;

  constructor({
    id,
    status,
    pairCreatedDate,
    startGameDate,
    finishGameDate,
    firstPlayer,
    secondPlayer,
    questions,
  }: QuizGameDBType) {
    this.id = id;
    this.status = status;
    this.pairCreatedDate = pairCreatedDate;
    this.startGameDate = startGameDate;
    this.finishGameDate = finishGameDate;

    this.firstPlayerProgress = new QuizGamePlayerProgressViewModel(firstPlayer);
    this.secondPlayerProgress = secondPlayer
      ? new QuizGamePlayerProgressViewModel(secondPlayer)
      : null;
    this.questions = questions
      ? questions.map(
          (q) => new QuizGameQuestionViewModel(q.question.id, q.question.body),
        )
      : null;
  }
}
