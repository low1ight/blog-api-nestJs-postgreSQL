import { Injectable } from '@nestjs/common';
import { CreateCommentInputDto } from '../../controllers/dto/CreateCommentInputDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createCommentForPost(
    postId: number,
    ownerId: number,
    { content }: CreateCommentInputDto,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `
    
    
    INSERT INTO public."Comments"(
     "postId", content, "createdAt", "ownerId")
    VALUES ( $1, $2, now(), $3)
    RETURNING "id"
    
    `,
      [postId, content, ownerId],
    );
    return result[0].id;
  }

  async getPostIdOfComment(commentId: number): Promise<number | null> {
    const result = await this.dataSource.query(
      `
    SELECT "postId" FROM "Comments" 
    WHERE "id" = $1
    `,
      [commentId],
    );

    return result[0]?.postId || null;
  }
}
