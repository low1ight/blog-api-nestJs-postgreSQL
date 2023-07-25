import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentViewModel } from './dto/CommentViewModel';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

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
