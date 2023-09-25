import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostViewModel } from './dto/postViewModel';
import { PostQueryMapper } from '../controllers/dto/query/PostQueryMapper';
import { Paginator } from '../../../../utils/paginatorHelpers/Paginator';
import { Post } from '../entity/Post.entity';
import { Blog } from '../../blogs/entity/Blog.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private PostsRepository: Repository<Post>,
  ) {}

  async getPosts(
    blogId: number | null,
    mappedQuery: PostQueryMapper,
    currentUserId: number | null = null,
  ) {
    const orderBy = 'post.' + mappedQuery.getSortBy();
    const queryBuilder = this.PostsRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
      .where('blog.isBanned = :isBanned', { isBanned: false });

    if (blogId !== null) {
      queryBuilder.andWhere('blog.id = :blogId', { blogId });
    }

    const [posts, count] = await queryBuilder
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize())
      .offset(mappedQuery.getOffset())
      .getManyAndCount();

    //  const posts = await this.dataSource.query(
    //    `
    //
    //  SELECT p."id", "blogId", "title", "shortDescription", "content", p."createdAt",
    // (SELECT "name" AS "blogName" FROM "Blogs"  WHERE "id" = p."blogId"  ),
    //
    // (SELECT Count(*) AS "totalLikesCount" FROM public."PostsLikes" l
    // JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
    // WHERE "likeStatus" = 'Like' AND p."id" = l."postId"),
    //
    // (SELECT Count(*) AS "totalDislikesCount" FROM public."PostsLikes" l
    // JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
    //  WHERE "likeStatus" = 'Dislike' AND p."id" = l."postId"),
    //
    //  (SELECT "likeStatus" AS "myStatus" FROM public."PostsLikes" l
    //  WHERE p."id" = l."postId" AND l."userId" = $2),
    //
    //   l."likeUserId","likeAddedAt","likeUserLogin"
    //
    //
    //    FROM public."Posts" p
    //
    //   LEFT JOIN  (SELECT
    //  l."userId" AS "likeUserId",
    //  l."postId",
    //  l."createdAt" AS "likeAddedAt",
    //  (SELECT "login" AS "likeUserLogin" FROM "Users" u WHERE u."id" = l."userId" ),
    //  ROW_NUMBER() OVER (PARTITION BY l."postId" ORDER BY l."createdAt" DESC) AS rn
    //   FROM public."PostsLikes" l
    //   JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
    //   WHERE "likeStatus" = 'Like'
    //
    //
    //  ) l ON l."postId" = p."id"
    //
    //
    //   LEFT JOIN "Blogs" g ON g."id" = p."blogId"
    //
    //     WHERE ("blogId" = $1 OR $1 IS NULL) AND (l.rn <= 3 OR l."postId" IS NULL) AND g."isBanned" = false
    //
    //    ORDER BY "${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()},"likeAddedAt" DESC
    //    LIMIT ${mappedQuery.getPageSize()}
    //    OFFSET ${mappedQuery.getOffset()}
    //
    //  `,
    //    [blogId, currentUserId],
    //  );
    //
    //  const totalCount = await this.dataSource.query(
    //    `
    //  SELECT Count(*)
    //
    //
    //    FROM public."Posts" p WHERE "blogId" = $1 OR $1 IS NULL
    //
    //  `,
    //    [blogId],
    //  );

    const postsViewModels: PostViewModel[] = posts.map(
      (post) => new PostViewModel(post),
    );

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(postsViewModels, count);
  }

  async getPostById(postId: number, currentUserId: null | number) {
    const post: Post & { blog: Blog } =
      await this.PostsRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .where('blog.isBanned = :isBanned', { isBanned: false })
        .andWhere('post.id = :postId', { postId })
        .getOne();

    return new PostViewModel(post);
    //   const post: PostsWithBlogDataAndLikesRaw[] = await this.dataSource.query(
    //     `
    //
    //
    //   SELECT p."id", "blogId", "title", "shortDescription", "content", p."createdAt",
    //  (SELECT "name" AS "blogName" FROM "Blogs"   WHERE "id" = p."blogId"  ),
    //
    //  (SELECT Count(*) AS "totalLikesCount" FROM public."PostsLikes" l
    //  JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
    //  WHERE "likeStatus" = 'Like' AND p."id" = l."postId"),
    //
    //  (SELECT Count(*) AS "totalDislikesCount" FROM public."PostsLikes" l
    //  JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
    //   WHERE "likeStatus" = 'Dislike' AND p."id" = l."postId"),
    //
    //   (SELECT "likeStatus" AS "myStatus" FROM public."PostsLikes" l
    //   WHERE p."id" = l."postId" AND l."userId" = $2),
    //
    //    l."likeUserId","likeAddedAt","likeUserLogin"
    //
    //
    //     FROM public."Posts" p
    //
    //    LEFT JOIN  (SELECT
    //   l."userId" AS "likeUserId",
    //   l."postId",
    //   l."createdAt" AS "likeAddedAt",
    //   (SELECT "login" AS "likeUserLogin" FROM "Users" u WHERE u."id" = l."userId" ),
    //   ROW_NUMBER() OVER (PARTITION BY l."postId" ORDER BY l."createdAt" DESC) AS rn
    //    FROM public."PostsLikes" l
    //     JOIN "UsersBanInfo" b ON l."userId" = b."userId" AND b."isBanned" = false
    //   WHERE "likeStatus" = 'Like'
    //
    // ) l ON l."postId" = p."id"
    //
    //
    //  LEFT JOIN "Blogs" g ON g."id" = p."blogId"
    //
    //
    //
    //    WHERE p."id" = $1 AND (l.rn <= 3 OR l."postId" IS NULL) AND g."isBanned" = false
    //
    //
    //   `,
    //     [postId, currentUserId],
    //   );
    //
    //   return post[0] ? this.toViewModelWithLikes(post)[0] : null;
  }

  // toViewModelWithLikes(posts: PostsWithBlogDataAndLikesRaw[]): PostViewModel[] {
  //   const result = [];
  //   const addedPosts = {};
  //
  //   for (const post of posts) {
  //     let currentPost = addedPosts[post.id];
  //     if (!currentPost) {
  //       currentPost = new PostViewModel(post);
  //
  //       result.push(currentPost);
  //
  //       addedPosts[post.id] = currentPost;
  //     }
  //
  //     if (post.likeUserId && post.likeUserLogin && post.likeAddedAt) {
  //       currentPost.extendedLikesInfo.newestLikes.push(
  //         new LikeForPostViewModel(
  //           post.likeUserId,
  //           post.likeUserLogin,
  //           post.likeAddedAt,
  //         ),
  //       );
  //     }
  //   }
  //
  //   return result;
  // }
}
