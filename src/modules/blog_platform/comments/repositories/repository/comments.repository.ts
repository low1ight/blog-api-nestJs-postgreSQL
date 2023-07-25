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
  ) {
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
}
