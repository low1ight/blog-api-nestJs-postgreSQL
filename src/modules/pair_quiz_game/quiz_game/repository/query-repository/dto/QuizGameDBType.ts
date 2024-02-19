import { PlayerDBType } from './PlayerDBType';

export type QuizGameDBType = {
  id: string;
  status: string;
  pairCreatedDate: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
  firstPlayer: PlayerDBType;
  secondPlayer: PlayerDBType | null;
  questions: Question[] | null;
};

type Question = {
  quizGameId: string;
  questionId: string;
  questionNumber: number;
  question: {
    id: string;
    body: string;
    correctAnswers: string[];
  };
};
