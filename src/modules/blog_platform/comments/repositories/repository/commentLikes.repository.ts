import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentLikeDbModel } from '../dto/CommentLikeDbModel';

@Injectable()
export class CommentLikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserLikeForComment(
    userId: number,
    commentId: number,
  ): Promise<CommentLikeDbModel | null> {
    const like = await this.dataSource.query(
      `
    
    SELECT * FROM "CommentsLikes"
    WHERE "userId" = $1 AND "commentId" = $2
    
    `,
      [userId, commentId],
    );

    return like[0] || null;
  }

  async createLikeForComment(
    commentId: number,
    userId: number,
    likeStatus: string,
  ) {
    await this.dataSource.query(
      `
    
    INSERT INTO public."CommentsLikes"(
    "commentId", "userId", "likeStatus", "createdAt")
    VALUES ($1, $2, $3, now());
    
    `,
      [commentId, userId, likeStatus],
    );
  }

  async updateLikeStatusForComment(
    commentId: number,
    userId: number,
    likeStatus: string,
  ) {
    await this.dataSource.query(
      `
    
    UPDATE public."CommentsLikes"
    SET  "likeStatus"=$3 , "createdAt"=now()
    WHERE "commentId"=$1 AND "userId"=$2
    
    `,
      [commentId, userId, likeStatus],
    );
  }

  async deleteLikeForComment(commentId: number, userId: number) {
    await this.dataSource.query(
      `
    
    DELETE FROM public."CommentsLikes"
    WHERE "commentId"=$1 AND "userId"=$2
    
    `,
      [commentId, userId],
    );
  }
}
