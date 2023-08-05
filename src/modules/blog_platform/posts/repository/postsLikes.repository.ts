import { SetLikeStatusForPostDto } from '../controllers/dto/SetLikeStatusForPostDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PostsLikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createUserLikeForPost(
    { likeStatus }: SetLikeStatusForPostDto,
    postId: number,
    userId: number,
  ) {
    await this.dataSource.query(
      `
    
    
    INSERT INTO public."PostsLikes"(
    "postId", "userId", "likeStatus", "createdAt")
    VALUES ($1, $2, $3, now());
    
    `,
      [postId, userId, likeStatus],
    );
  }

  async getLike(postId: number, userId: number) {
    const like = await this.dataSource.query(
      `
    
    SELECT * FROM "PostsLikes"
    WHERE "postId" = $1 AND "userId" = $2
    
    `,
      [postId, userId],
    );

    return like[0] || null;
  }

  async updateLikeStatusById(
    postId: number,
    userId: number,
    { likeStatus }: SetLikeStatusForPostDto,
  ) {
    await this.dataSource.query(
      `
    
    UPDATE public."PostsLikes"
    SET "likeStatus"=$3, "createdAt"=now()
    WHERE "postId"=$1 AND "userId" = $2
    
    
    `,
      [postId, userId, likeStatus],
    );
  }

  async deleteLikeForPost(postId: number, userId: number) {
    await this.dataSource.query(
      `
    
    DELETE FROM public."PostsLikes"
    WHERE "postId"=$1 AND "userId" = $2
    
    
    `,
      [postId, userId],
    );
  }
}
