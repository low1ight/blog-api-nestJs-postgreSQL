import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AllBlogsCommentViewModel,
  CommentViewModel,
} from './dto/CommentViewModel';
import { CommentQueryMapper } from '../../controllers/dto/query/CommentQueryMapper';
import { Paginator } from '../../../../../utils/paginatorHelpers/Paginator';
import { Comment } from '../../entity/Comment.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getComments(
    postId: number | null,
    mappedQuery: CommentQueryMapper,
    currentUserId: number | null,
  ) {
    const orderBy = 'comment.' + mappedQuery.getSortBy();

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id as id',
        'comment.content as content',
        'comment.createdAt as "createdAt"',
        'comment.ownerId as "userId"',
      ])
      .where('comment."postId" = :postId', { postId })
      .addSelect([
        `(SELECT Count(*) FROM "CommentsLikes" c
        WHERE c."commentId" = comment.id AND c."likeStatus" = 'Like') as "totalLikesCount"`,
      ])
      .addSelect([
        `(SELECT Count(*) FROM "CommentsLikes" c
        WHERE c."commentId" = comment.id AND c."likeStatus" = 'Dislike') as "totalDislikesCount"`,
      ])
      .addSelect([
        `(SELECT "likeStatus"  FROM public."CommentsLikes" l
    WHERE comment.id = l."commentId" AND l."userId" = :userId) AS "myStatus"`,
      ])

      .setParameter('userId', currentUserId)
      .leftJoin('comment.user', 'user')
      .addSelect(['user.login as "userLogin"'])
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize())
      .offset(mappedQuery.getOffset())
      .getRawMany();

    const totalCount = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment."postId" = :postId', { postId })
      .getCount();

    const commentsViewModel: CommentViewModel[] = comments.map(
      (item) => new CommentViewModel(item),
    );

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(commentsViewModel, totalCount);
  }

  async getCommentById(commentId: number, userId: number | null) {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id as id',
        'comment.content as content',
        'comment.createdAt as "createdAt"',
        'comment.ownerId as "userId"',
      ])
      .where('comment.id = :commentId', { commentId })
      .addSelect([
        `(SELECT Count(*) FROM "CommentsLikes" c
        WHERE c."commentId" = comment.id AND c."likeStatus" = 'Like') as "totalLikesCount"`,
      ])
      .addSelect([
        `(SELECT Count(*) FROM "CommentsLikes" c
        WHERE c."commentId" = comment.id AND c."likeStatus" = 'Dislike') as "totalDislikesCount"`,
      ])
      .addSelect([
        `(SELECT "likeStatus"  FROM public."CommentsLikes" l
    WHERE comment.id = l."commentId" AND l."userId" = :userId) AS "myStatus"`,
      ])

      .setParameter('userId', userId)
      .leftJoin('comment.user', 'user')
      .addSelect(['user.login as "userLogin"'])
      .getRawOne();

    return comment ? new CommentViewModel(comment) : null;
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
