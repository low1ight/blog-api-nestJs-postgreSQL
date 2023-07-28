import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentViewModel } from './dto/CommentViewModel';
import { CommentPaginator } from '../../controllers/dto/query/CommentPaginator';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getComments(
    postId: number | null,
    paginator: CommentPaginator,
    currentUserId: number | null,
  ) {
    const comments = await this.dataSource.query(
      `
    
    SELECT c."id",c."content", u."id" AS "userId", u."login" AS "userLogin",
    
    (SELECT Count(*) AS "totalLikesCount" FROM public."CommentsLikes" l
   WHERE "likeStatus" = 'Like' AND c."id" = l."commentId"),
   
   (SELECT Count(*) AS "totalDislikesCount" FROM public."CommentsLikes" l
    WHERE "likeStatus" = 'Dislike' AND c."id" = l."commentId"),
    
    (SELECT "likeStatus" AS "myStatus" FROM public."CommentsLikes" l
    WHERE c."id" = l."commentId" AND l."userId" = $2)
    
    FROM "Comments" c
    JOIN "Users" u ON u."id" = c."ownerId"
    WHERE c."postId" = $1 OR $1 IS NULL
    ORDER BY c."${paginator.getSortBy()}" ${paginator.getSortDirection()}
      LIMIT ${paginator.getPageSize()}
      OFFSET ${paginator.getOffset()}
    
    
    
    `,
      [postId, currentUserId],
    );

    const totalCount = await this.dataSource.query(
      `
    SELECT Count(*)
     

       FROM "Comments" c WHERE c."postId" = $1 OR $1 IS NULL
    
    `,
      [postId],
    );

    const commentsViewModel: CommentViewModel[] = comments.map(
      (item) => new CommentViewModel(item),
    );

    return paginator.paginate(commentsViewModel, Number(totalCount[0].count));
  }

  async getCommentById(commentId: number) {
    const result = await this.dataSource.query(
      `
    
    SELECT c."id",c."content", u."id" AS "userId", u."login" AS "userLogin"
    FROM "Comments" c
    JOIN "Users" u ON u."id" = c."ownerId"
    WHERE c."id" = $1
    
    
    `,
      [commentId],
    );

    return new CommentViewModel(result[0]) || null;
  }
}
