import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsWithBlogDataAndLikesRaw } from './dto/PostDbModelWithBlogName';
import { PostViewModel } from './dto/postViewModel';
import { PostQueryMapper } from '../controllers/dto/query/PostQueryMapper';
import { LikeForPostViewModel } from './dto/LikeForPostViewModel';
import { Paginator } from '../../../../utils/paginatorHelpers/Paginator';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPosts(
    blogId: number | null,
    mappedQuery: PostQueryMapper,
    currentUserId: number | null = null,
  ) {
    const posts = await this.dataSource.query(
      `
    
    SELECT id, "blogId", "title", "shortDescription", "content", "createdAt",
   (SELECT "name" AS "blogName" FROM "Blogs"  WHERE "id" = p."blogId"  ),
   
   (SELECT Count(*) AS "totalLikesCount" FROM public."PostsLikes" l
   WHERE "likeStatus" = 'Like' AND p."id" = l."postId"),
   
   (SELECT Count(*) AS "totalDislikesCount" FROM public."PostsLikes" l
    WHERE "likeStatus" = 'Dislike' AND p."id" = l."postId"),
    
    (SELECT "likeStatus" AS "myStatus" FROM public."PostsLikes" l
    WHERE p."id" = l."postId" AND l."userId" = $2),
    
     l."likeUserId","likeAddedAt","likeUserLogin"
    
 
      FROM public."Posts" p 
      
     LEFT JOIN  (SELECT
    l."userId" AS "likeUserId",
    l."postId",
    l."createdAt" AS "likeAddedAt",
    (SELECT "login" AS "likeUserLogin" FROM "Users" u WHERE u."id" = l."userId" )
     FROM public."PostsLikes" l
    WHERE "likeStatus" = 'Like'
    ORDER BY "createdAt" DESC
    LIMIT 5) l ON l."postId" = p."id"
      
      WHERE "blogId" = $1 OR $1 IS NULL
     
      ORDER BY "${mappedQuery.getSortBy()}" ${mappedQuery.getSortDirection()}
      LIMIT ${mappedQuery.getPageSize()}
      OFFSET ${mappedQuery.getOffset()}
    
    `,
      [blogId, currentUserId],
    );

    const totalCount = await this.dataSource.query(
      `
    SELECT Count(*)
     

      FROM public."Posts" p WHERE "blogId" = $1 OR $1 IS NULL
    
    `,
      [blogId],
    );

    const postsViewModels: PostViewModel[] = this.toViewModelWithLikes(posts);

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    return paginator.paginate(postsViewModels, Number(totalCount[0].count));
  }

  async getPostById(postId: number, currentUserId: null | number) {
    const post: PostsWithBlogDataAndLikesRaw[] = await this.dataSource.query(
      `
    
    
    SELECT id, "blogId", "title", "shortDescription", "content", "createdAt",
   (SELECT "name" AS "blogName" FROM "Blogs"   WHERE "id" = p."blogId"  ),
   
   (SELECT Count(*) AS "totalLikesCount" FROM public."PostsLikes" l
   WHERE "likeStatus" = 'Like' AND p."id" = l."postId"),
   
   (SELECT Count(*) AS "totalDislikesCount" FROM public."PostsLikes" l
    WHERE "likeStatus" = 'Dislike' AND p."id" = l."postId"),
    
    (SELECT "likeStatus" AS "myStatus" FROM public."PostsLikes" l
    WHERE p."id" = l."postId" AND l."userId" = $2),
    
     l."likeUserId","likeAddedAt","likeUserLogin"
    
 
      FROM public."Posts" p 
      
     LEFT JOIN  (SELECT
    l."userId" AS "likeUserId",
    l."postId",
    l."createdAt" AS "likeAddedAt",
    (SELECT "login" AS "likeUserLogin" FROM "Users" u WHERE u."id" = l."userId" )
     FROM public."PostsLikes" l
    WHERE "likeStatus" = 'Like'
    ORDER BY "createdAt" DESC
    LIMIT 5) l ON l."postId" = p."id"
    
     
     WHERE p."id" = $1 
    
    
    `,
      [postId, currentUserId],
    );

    return post[0] ? this.toViewModelWithLikes(post)[0] : null;
  }

  toViewModelWithLikes(posts: PostsWithBlogDataAndLikesRaw[]): PostViewModel[] {
    const result = [];
    const addedPosts = {};

    for (const post of posts) {
      let currentPost = addedPosts[post.id];
      if (!currentPost) {
        currentPost = new PostViewModel(post);

        result.push(currentPost);

        addedPosts[post.id] = currentPost;
      }

      currentPost.extendedLikesInfo.newestLikes.push(
        new LikeForPostViewModel(
          post.likeUserId,
          post.likeUserLogin,
          post.likeAddedAt,
        ),
      );
    }
    return result;
  }
}
