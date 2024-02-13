import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../entity/Quiz.questions.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuizQuestionQueryMapper } from '../controllets/dto/query/QuizQuestionQueryMapper';
import { Paginator } from '../../../utils/paginatorHelpers/Paginator';

@Injectable()
export class QuizQuestionQueryRepo {
  constructor(
    @InjectRepository(QuizQuestions)
    private quizQuestionQueryRepository: Repository<QuizQuestions>,
  ) {}

  async getQuizQuestions(query: QuizQuestionQueryMapper) {
    const orderBy = 'quizQuestions.' + query.getSortBy();

    const questions = await this.quizQuestionQueryRepository
      .createQueryBuilder('quizQuestions')
      .orderBy(orderBy, query.getSortDirection())
      .limit(query.getPageSize())
      .offset(query.getOffset())
      .getMany();

    const totalCount = await this.quizQuestionQueryRepository
      .createQueryBuilder('quizQuestions')
      .getCount();

    const paginator = new Paginator(query.getPageSize(), query.getPageNumber());

    return paginator.paginate(questions, totalCount);
  }
}
