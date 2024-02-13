import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../entity/Quiz.questions.entity';
import { Repository } from 'typeorm';
import { CreateQuizQuestionInputDto } from '../controllets/dto/CreateQuizQuestionInputDto';
import { SetPublishQuizQuestionStatusDto } from '../controllets/dto/SetPublishQuizQuestionStatusDto';
import { UpdateQuizQuestionInputDto } from '../controllets/dto/UpdateQuizQuestionInputDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizQuestionsRepo {
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

  async updatePublishQuestionStatusById(
    { body, correctAnswers }: UpdateQuizQuestionInputDto,
    id: string,
  ) {
    const question = await this.quizQuestionRepository.findOneBy({ id });
    question.body = body;
    question.correctAnswers = correctAnswers;
    return await this.quizQuestionRepository.save(question);
  }

  async setPublishQuestionStatus(
    dto: SetPublishQuizQuestionStatusDto,
    id: string,
  ) {
    const question = await this.quizQuestionRepository.findOneBy({ id });
    question.published = dto.published;
    return await this.quizQuestionRepository.save(question);
  }

  async deleteQuizQuestionById(id: string) {
    return await this.quizQuestionRepository.delete({ id });
  }
}