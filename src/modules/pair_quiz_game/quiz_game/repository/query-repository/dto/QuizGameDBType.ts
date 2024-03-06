import { PlayerDBType } from './PlayerDBType';
import { PlayerAnswerDbModel } from './PlayerAnswerDbModel';

export type QuizGameDBType = {
  id: string;
  status: string;
  pairCreatedDate: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
  firstPlayer: PlayerDBType;
  secondPlayer: PlayerDBType | null;
  playerAnswers: PlayerAnswerDbModel[];
  questions: QuestionDBType[] | null;
};

export type QuestionDBType = {
  quizGameId: string;
  questionId: string;
  questionNumber: number;
  question: {
    id: string;
    body: string;
    correctAnswers: string[];
  };
};
