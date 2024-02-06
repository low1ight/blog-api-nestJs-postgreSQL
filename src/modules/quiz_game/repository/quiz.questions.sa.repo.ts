import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../entity/Quiz.questions.entity';
import { Repository } from 'typeorm';
import { CreateQuizQuestionInputDto } from '../controllets/dto/CreateQuizQuestionInputDto';
import { SetPublishQuestionStatusDto } from '../controllets/dto/SetPublishQuestionStatusDto';

export class QuizQuestionsSaRepo {
  constructor(
    @InjectRepository(QuizQuestions)
    private quizQuestionRepository: Repository<QuizQuestions>,
  ) {}

  async createQuizQuestion({
    body,
    correctAnswers,
  }: CreateQuizQuestionInputDto) {
    const quizQuestion = new QuizQuestions();
    quizQuestion.body = body;
    quizQuestion.createdAt = new Date();
    quizQuestion.updatedAt = new Date();
    quizQuestion.published = false;
    quizQuestion.correctAnswers = correctAnswers;

    return await this.quizQuestionRepository.save(quizQuestion);
  }

  async getQuizQuestionById(id: string) {
    return await this.quizQuestionRepository.findOneBy({ id });
  }

  async setPublishQuestionStatus(dto: SetPublishQuestionStatusDto, id: string) {
    const question = await this.quizQuestionRepository.findOneBy({ id });
    question.published = dto.published;
    return await this.quizQuestionRepository.save(question);
  }

  async deleteQuizQuestionById(id: string) {
    return await this.quizQuestionRepository.delete({ id });
  }
}
