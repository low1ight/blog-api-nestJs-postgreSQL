import { QuizQuestionDBModel } from './QuizQuestionDBModel';

export class QuizQuestionSaViewModel {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor({
    id,
    body,
    correctAnswers,
    published,
    createdAt,
    updatedAt,
  }: QuizQuestionDBModel) {
    this.id = id;
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.published = published;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
