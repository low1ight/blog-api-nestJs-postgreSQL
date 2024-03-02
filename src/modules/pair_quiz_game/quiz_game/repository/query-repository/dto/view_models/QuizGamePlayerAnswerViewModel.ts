import { PlayerAnswerDbModel } from '../PlayerAnswerDbModel';

export class QuizGamePlayerAnswerViewModel {
  questionId: string;
  answerStatus: string;
  addedAt: Date;
  constructor(
    { questionId, questionAnswer, addedAt }: PlayerAnswerDbModel,
    questionCorrectAnswers: string[],
  ) {
    this.questionId = questionId;
    this.answerStatus = questionCorrectAnswers.includes(questionAnswer)
      ? 'Correct'
      : 'Incorrect';
    this.addedAt = addedAt;
  }
}
