import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostViewModel } from './dto/postViewModel';
import { PostQueryMapper } from '../controllers/dto/query/PostQueryMapper';
import { Paginator } from '../../../../utils/paginatorHelpers/Paginator';
import { Post } from '../entity/Post.entity';
import { PostLikes } from '../entity/PostLikes.entity';
import { PostsWithBlogDataAndLikesRaw } from './dto/PostDbModelWithBlogName';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PostLikes)
    private postLikesRepository: Repository<PostLikes>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getPosts(
    blogId: number | null,
    mappedQuery: PostQueryMapper,
    currentUserId: number | null = null,
  ) {
    let orderBy: string = mappedQuery.getSortBy();
    if (orderBy.toLowerCase() === 'blogname') orderBy = 'b.name';
    else orderBy = 'p.' + orderBy;

    const queryBuilder = this.postRepository.createQueryBuilder('p');
    const queryCount = this.postRepository.createQueryBuilder('p');

    if (blogId !== null) {
      queryBuilder.andWhere('p."blogId" = :blogId', { blogId });
      queryCount.andWhere('p."blogId" = :blogId', { blogId });
    }

    queryBuilder
      .select([
        'p.id as id',
        'p.blogId as "blogId"',
        'p.title as title',
        'p."shortDescription" as "shortDescription"',
        'p.content as content',
        'p.createdAt as "createdAt"',
        'b.name as "blogName"',
      ])
      .addSelect(
        (qb) =>
          qb
            .select(
              `jsonb_agg(json_build_object('addedAt', to_char(
            agg."createdAt"::timestamp at time zone 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'userId', cast(agg.id as varchar),
            'login', agg.login)
                 )`,
            )
            .from((qb) => {
              return qb
                .select([
                  'pl.createdAt as "createdAt"',
                  'pl.userId as "id"',
                  'us.login as login',
                ])
                .from(PostLikes, 'pl')
                .where('pl.postId = p.id')
                .leftJoin('pl.user', 'us')
                .andWhere("pl.likeStatus = 'Like'")
                .orderBy('"createdAt"', 'DESC')
                .limit(3);
            }, 'agg'),

        'newestLikes',
      )
      .leftJoin('p.blog', 'b')
      .where('b.isBanned = :isBanned', { isBanned: false })
      .addSelect([
        `(SELECT Count(*) FROM "PostsLikes" pl
        WHERE pl."postId" = p.id AND pl."likeStatus" = 'Like') as "totalLikesCount"`,
      ])
      .addSelect([
        `(SELECT Count(*) FROM "PostsLikes" pl
          WHERE pl."postId" = p.id AND pl."likeStatus" = 'Dislike') as "totalDislikesCount"`,
      ])
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize());

    if (currentUserId) {
      queryBuilder
        .addSelect([
          `(SELECT "likeStatus"  FROM public."PostsLikes" pl
      WHERE p.id = pl."postId" AND pl."userId" = :userId) AS "myStatus"`,
        ])
        .setParameter('userId', currentUserId);
    }

    const posts = await queryBuilder.getRawMany();

    const count = await queryCount.getCount();

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(this.toViewModelWithLikes(posts), count);
  }

  async getPostById(postId: number, currentUserId: null | number) {
    const query = this.postRepository
      .createQueryBuilder('p')
      .where('p.id = :postId', { postId })
      .select([
        'p.id as id',
        'p.blogId as "blogId"',
        'p.title as title',
        'p."shortDescription" as "shortDescription"',
        'p.content as content',
        'p.createdAt as "createdAt"',
        'b.name as "blogName"',
      ])
      .addSelect(
        (qb) =>
          qb
            .select(
              `jsonb_agg(json_build_object('addedAt', to_char(
            agg."createdAt"::timestamp at time zone 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'userId', cast(agg.id as varchar),
            'login', agg.login)
                 )`,
            )
            .from((qb) => {
              return qb
                .select([
                  'pl.createdAt as "createdAt"',
                  'pl.userId as "id"',
                  'us.login as login',
                ])
                .from(PostLikes, 'pl')
                .where('pl.postId = p.id')
                .leftJoin('pl.user', 'us')
                .andWhere("pl.likeStatus = 'Like'")
                .orderBy('"createdAt"', 'DESC')
                .limit(3);
            }, 'agg'),

        'newestLikes',
      )
      .leftJoin('p.blog', 'b')
      .where('b.isBanned = :isBanned', { isBanned: false })
      .addSelect([
        `(SELECT Count(*) FROM "PostsLikes" pl
        WHERE pl."postId" = p.id AND pl."likeStatus" = 'Like') as "totalLikesCount"`,
      ])
      .addSelect([
        `(SELECT Count(*) FROM "PostsLikes" pl
          WHERE pl."postId" = p.id AND pl."likeStatus" = 'Dislike') as "totalDislikesCount"`,
      ])
      .limit(10);

    if (currentUserId) {
      query
        .addSelect([
          `(SELECT "likeStatus"  FROM public."PostsLikes" pl
      WHERE p.id = pl."postId" AND pl."userId" = :userId) AS "myStatus"`,
        ])
        .setParameter('userId', currentUserId);
    }

    const post = await query.getRawMany();

    return post ? this.toViewModelWithLikes(post)[0] : null;
  }

  toViewModelWithLikes(posts: PostsWithBlogDataAndLikesRaw[]): PostViewModel[] {
    return posts.map((post) => new PostViewModel(post));
  }
}
