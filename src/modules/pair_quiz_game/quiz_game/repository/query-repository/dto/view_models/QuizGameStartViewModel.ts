import { QuizGameDBType } from '../QuizGameDBType';
import { QuizGamePlayerProgressViewModel } from './QuizGamePlayerProgressViewModel';
import { QuizGameQuestionViewModel } from './QuizGameQuestionViewModel';

export class QuizGameStartViewModel {
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
    playerAnswers,
    questions,
  }: QuizGameDBType) {
    this.id = id;
    this.status = status;
    this.pairCreatedDate = pairCreatedDate;
    this.startGameDate = startGameDate;
    this.finishGameDate = finishGameDate;

    this.firstPlayerProgress = new QuizGamePlayerProgressViewModel(
      firstPlayer,
      playerAnswers,
      questions,
    );
    this.secondPlayerProgress = secondPlayer
      ? new QuizGamePlayerProgressViewModel(
          secondPlayer,
          playerAnswers,
          questions,
        )
      : null;
    this.questions = questions
      ? questions.map(
          (q) => new QuizGameQuestionViewModel(q.question.id, q.question.body),
        )
      : null;

    if (status === 'Finished') {
      const fp = this.firstPlayerProgress;
      const sp = this.secondPlayerProgress;
      if (
        fp.score >= 1 &&
        fp.answers[fp.answers.length - 1]?.addedAt <
          sp.answers[sp.answers.length - 1].addedAt
      ) {
        ++this.firstPlayerProgress.score;
      } else if (sp.score >= 1) {
        ++this.secondPlayerProgress.score;
      }
    }

    // if (
    //   this.isUserCanGetAdditionalBonusPoint(
    //     this.firstPlayerProgress,
    //     this.secondPlayerProgress.answers[4]?.addedAt,
    //   )
    // ) {
    //   this.firstPlayerProgress.score++;
    // }
    // if (
    //   this.isUserCanGetAdditionalBonusPoint(
    //     this.secondPlayerProgress,
    //     this.firstPlayerProgress.answers[4]?.addedAt,
    //   )
    // ) {
    //   this.secondPlayerProgress.score++;
    // }
  }

  // private isUserCanGetAdditionalBonusPoint(
  //   player: QuizGamePlayerProgressViewModel,
  //   anotherPlayerDate: Date | undefined,
  // ): boolean {
  //   return (
  //     (player.score >= 1 &&
  //     player.answers[player.answers.length - 1]?.addedAt < anotherPlayerDate
  //   );
  // }
}
