import { QueryDto } from '../../../../../utils/paginatorHelpers/QueryDto';

export class QuizQuestionQueryDto extends QueryDto {
  bodySearchTerm: string;
  publishedStatus: string;
}
