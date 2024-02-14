import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../entity/QuizQuestions.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuizQuestionQueryMapper } from '../controllets/dto/query/QuizQuestionQueryMapper';
import { Paginator } from '../../../../utils/paginatorHelpers/Paginator';
import { QuizQuestionDBModel } from './dto/QuizQuestionDBModel';
import { QuizQuestionSaViewModel } from './dto/QuizQuestionSaViewModel';

@Injectable()
export class QuizQuestionQueryRepo {
  constructor(
    @InjectRepository(QuizQuestions)
    private quizQuestionQueryRepository: Repository<QuizQuestions>,
  ) {}

  async getQuizQuestions(query: QuizQuestionQueryMapper) {
    const orderBy = 'quizQuestions.' + query.getSortBy();
    const bodySearchTerm = `%${query.bodySearchTerm}%`;

    const queryBuilder = this.quizQuestionQueryRepository
      .createQueryBuilder('quizQuestions')
      .orderBy(orderBy, query.getSortDirection())
      .where('quizQuestions.body ILIKE :body', {
        body: bodySearchTerm,
      })
      .limit(query.getPageSize())
      .offset(query.getOffset());

    if (query.publishedStatus !== 'all') {
      queryBuilder.andWhere('quizQuestions.published = :published', {
        published: query.publishedStatus === 'published',
      });
    }

    const questions: QuizQuestionDBModel[] = await queryBuilder.getMany();

    const totalCount = await this.quizQuestionQueryRepository
      .createQueryBuilder('quizQuestions')
      .where('quizQuestions.body ILIKE :body', {
        body: bodySearchTerm,
      })
      .getCount();

    const paginator = new Paginator(query.getPageSize(), query.getPageNumber());

    const questionViewModel: QuizQuestionSaViewModel[] = questions.map(
      (i) => new QuizQuestionSaViewModel(i),
    );

    return paginator.paginate(questionViewModel, totalCount);
  }
}
