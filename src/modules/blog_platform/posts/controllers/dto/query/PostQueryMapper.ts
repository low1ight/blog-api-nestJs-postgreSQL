import { PostsQueryDto } from './PostsQueryDto';
import { QueryMapper } from '../../../../../../utils/paginatorHelpers/QueryMapper';

export class PostQueryMapper extends QueryMapper {
  constructor({ pageNumber, pageSize, sortBy, sortDirection }: PostsQueryDto) {
    super({ pageNumber, pageSize, sortBy, sortDirection });
  }
}
