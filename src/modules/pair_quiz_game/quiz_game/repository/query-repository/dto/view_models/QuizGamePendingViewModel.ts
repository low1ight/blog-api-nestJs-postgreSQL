import { QuizGameDBType } from '../QuizGameDBType';
import { QuizGamePlayerProgressViewModel } from './QuizGamePlayerProgressViewModel';

export class QuizGamePendingViewModel {
  id: string;
  firstPlayerProgress: QuizGamePlayerProgressViewModel;
  secondPlayerProgress: null;
  questions: null;
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
  }: QuizGameDBType) {
    this.id = id;
    this.status = status;
    this.pairCreatedDate = pairCreatedDate;
    this.startGameDate = startGameDate;
    this.finishGameDate = finishGameDate;

    this.firstPlayerProgress = new QuizGamePlayerProgressViewModel(
      firstPlayer,
      [],
      []
    );
    this.secondPlayerProgress = null;

    this.questions = null;
  }
}
