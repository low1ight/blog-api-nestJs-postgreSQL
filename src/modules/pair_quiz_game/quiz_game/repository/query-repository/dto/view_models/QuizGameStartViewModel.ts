import { QuizGameDBType } from '../QuizGameDBType';
import { QuizGamePlayerProgressViewModel } from './QuizGamePlayerProgressViewModel';
import { QuizGameQuestionViewModel } from './QuizGameQuestionViewModel';
import { QuizGamePlayerAnswerViewModel } from './QuizGamePlayerAnswerViewModel';

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
      playerAnswers
        .filter((i) => i.playerId === firstPlayer.id)
        .map(
          (question, index) =>
            new QuizGamePlayerAnswerViewModel(
              question,
              questions[index].question.correctAnswers,
            ),
        ),
    );
    this.secondPlayerProgress = secondPlayer
      ? new QuizGamePlayerProgressViewModel(
          secondPlayer,
          playerAnswers
            .filter((i) => i.playerId === secondPlayer.id)
            .map(
              (question, index) =>
                new QuizGamePlayerAnswerViewModel(
                  question,
                  questions[index].question.correctAnswers,
                ),
            ),
        )
      : null;
    this.questions = questions
      ? questions.map(
          (q) => new QuizGameQuestionViewModel(q.question.id, q.question.body),
        )
      : null;

    if (
      this.isUserCanGetAdditionalBonusPoint(
        this.firstPlayerProgress,
        this.secondPlayerProgress.answers[4]?.addedAt,
      )
    ) {
      this.firstPlayerProgress.score++;
    }
    if (
      this.isUserCanGetAdditionalBonusPoint(
        this.secondPlayerProgress,
        this.firstPlayerProgress.answers[4]?.addedAt,
      )
    ) {
      this.secondPlayerProgress.score++;
    }
  }

  private isUserCanGetAdditionalBonusPoint(
    player: QuizGamePlayerProgressViewModel,
    anotherPlayerDate: Date | undefined,
  ): boolean {
    return (
      (player.score >= 1 &&
        player.answers.length === 5 &&
        !anotherPlayerDate) ||
      player.answers[4]?.addedAt < anotherPlayerDate
    );
  }
}
