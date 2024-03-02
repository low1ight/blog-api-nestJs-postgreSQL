export type PlayerAnswerDbModel = {
  questionId: string;
  gameId: string;
  playerId: number;
  questionAnswer: string;
  addedAt: Date;
};
