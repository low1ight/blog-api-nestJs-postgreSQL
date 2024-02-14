import { QueryMapper } from '../../../../../../utils/paginatorHelpers/QueryMapper';
import { QuizQuestionQueryDto } from './QuizQuestionQueryDto';

export class QuizQuestionQueryMapper extends QueryMapper {
  publishedStatus: string;
  bodySearchTerm: string;
  constructor({
    publishedStatus,
    bodySearchTerm,
    sortBy,
    sortDirection,
    pageSize,
    pageNumber,
  }: QuizQuestionQueryDto) {
    super({ sortBy, sortDirection, pageNumber, pageSize });
    this.publishedStatus = this.publishedStatuses.includes(publishedStatus)
      ? publishedStatus.toLowerCase()
      : 'all';
    this.bodySearchTerm = bodySearchTerm || '';
  }

  private publishedStatuses: string[] = ['published', 'notpublished', 'all'];
}
