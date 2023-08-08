import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  AllBlogsCommentViewModel,
  CommentViewModel,
} from './dto/CommentViewModel';
import { CommentQueryMapper } from '../../controllers/dto/query/CommentQueryMapper';
import { Paginator } from '../../../../../utils/paginatorHelpers/Paginator';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getComments(
    postId: number | null,
    mappedQuery: CommentQueryMapper,
    currentUserId: number | null,
  ) {
    const comments = await this.dataSource.query(
      `
    
    SELECT c."id",c."content",c."createdAt", u."id" AS "userId", u."login" AS "userLogin",
    
    (SELECT Count(*) AS "totalLikesCount" FROM public."CommentsLikes" l
        JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
        WHERE "likeStatus" = 'Like' AND c."id" = l."commentId"),

       (SELECT Count(*) AS "totalDislikesCount" FROM public."CommentsLikes" l
        JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
        WHERE "likeStatus" = 'Dislike' AND c."id" = l."commentId"),
    
    (SELECT "likeStatus" AS "myStatus" FROM public."CommentsLikes" l
    WHERE c."id" = l."commentId" AND l."userId" = $2)
    
    FROM "Comments" c
    JOIN "Users" u ON u."id" = c."ownerId"
    JOIN "UsersBanInfo" b ON b."userId" = c."ownerId"
    WHERE c."postId" = $1 OR $1 IS NULL AND b."isBanned" = false
    ORDER BY c."${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()}
      LIMIT ${mappedQuery.getPageSize()}
      OFFSET ${mappedQuery.getOffset()}
    
    
    
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
    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(commentsViewModel, Number(totalCount[0].count));
  }

  async getCommentById(commentId: number, userId: number | null) {
    const result = await this.dataSource.query(
      `
    
    SELECT c."id",c."content",c."createdAt", u."id" AS "userId", u."login" AS "userLogin",
    b."isBanned",
        (SELECT Count(*) AS "totalLikesCount" FROM public."CommentsLikes" l
        JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
        WHERE "likeStatus" = 'Like' AND c."id" = l."commentId"),

       (SELECT Count(*) AS "totalDislikesCount" FROM public."CommentsLikes" l
        JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
        WHERE "likeStatus" = 'Dislike' AND c."id" = l."commentId"),
    
    (SELECT "likeStatus" AS "myStatus" FROM public."CommentsLikes" l
    WHERE c."id" = l."commentId" AND l."userId" = $2)
    FROM "Comments" c
    JOIN "Users" u ON u."id" = c."ownerId"
    JOIN "UsersBanInfo" b ON b."userId" = c."ownerId"
    
    WHERE c."id" = $1 AND b."isBanned" = false
    
    
    `,
      [commentId, userId],
    );

    return result[0] ? new CommentViewModel(result[0]) : null;
  }

  async getAllUserBlogsComments(
    mappedQuery: CommentQueryMapper,
    currentUserId: number | null,
  ) {
    const comments = await this.dataSource.query(
      `

    SELECT c."id",c."content",c."createdAt", 
    u."id" AS "userId", u."login" AS "userLogin",
    p."title" AS "postTitle", p."id" AS "postId",
    g."id" AS "blogId", g."name" AS "blogName",
    (SELECT Count(*) AS "totalLikesCount" FROM public."CommentsLikes" l
        JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
        WHERE "likeStatus" = 'Like' AND c."id" = l."commentId"),

       (SELECT Count(*) AS "totalDislikesCount" FROM public."CommentsLikes" l
        JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
        WHERE "likeStatus" = 'Dislike' AND c."id" = l."commentId"),

    (SELECT "likeStatus" AS "myStatus" FROM public."CommentsLikes" l
    WHERE c."id" = l."commentId" AND l."userId" = $1)

    FROM "Comments" c
    JOIN "Users" u ON u."id" = c."ownerId"
    JOIN "UsersBanInfo" b ON b."userId" = c."ownerId"
    JOIN "Posts" p ON p."id" = c."postId"
    JOIN "Blogs" g ON g."id" = p."blogId"
    WHERE b."isBanned" = false AND g."ownerId" = $1
    ORDER BY c."${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()}
      LIMIT ${mappedQuery.getPageSize()}
      OFFSET ${mappedQuery.getOffset()}



    `,
      [currentUserId],
    );

    const totalCount = await this.dataSource.query(
      `
    SELECT Count(*)


       FROM "Comments" c
    JOIN "Users" u ON u."id" = c."ownerId"
    JOIN "UsersBanInfo" b ON b."userId" = c."ownerId"
    JOIN "Posts" p ON p."id" = c."postId"
    JOIN "Blogs" g ON g."id" = p."blogId"
    WHERE b."isBanned" = false AND g."ownerId" = $1

    `,
      [currentUserId],
    );

    const commentsViewModel: AllBlogsCommentViewModel[] = comments.map(
      (item) => new AllBlogsCommentViewModel(item),
    );
    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(commentsViewModel, Number(totalCount[0].count));
  }
}
