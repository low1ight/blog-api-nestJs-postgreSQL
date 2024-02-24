export class QuizGamePlayerProgressAnswerViewModel {
  questionId: string;
  answerStatus: string;
  addedAt: Date;

  constructor(questionId: string, answerStatus: boolean, addedAt: Date) {
    this.questionId = questionId;
    this.answerStatus = answerStatus ? 'Correct' : 'Incorrect';
    this.addedAt = addedAt;
  }
}
