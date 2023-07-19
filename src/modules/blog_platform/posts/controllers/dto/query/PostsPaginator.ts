import { PostsQueryDto } from './PostsQueryDto';
import { Paginator } from '../../../../../../utils/paginatorHelpers/Paginator';

export class PostsPaginator extends Paginator {
  constructor({ pageNumber, pageSize, sortBy, sortDirection }: PostsQueryDto) {
    super({ pageNumber, pageSize, sortBy, sortDirection });
  }
}
