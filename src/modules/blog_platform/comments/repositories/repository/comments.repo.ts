import { Injectable } from '@nestjs/common';
import { CreateCommentInputDto } from '../../controllers/dto/CreateCommentInputDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entity/Comment.entity';

@Injectable()
export class CommentsRepo {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}
  async createCommentForPost(
    postId: number,
    ownerId: number,
    { content }: CreateCommentInputDto,
  ): Promise<number> {
    const comment = new Comment();
    comment.postId = postId;
    comment.content = content;
    comment.ownerId = ownerId;
    comment.createdAt = new Date();

    const createdComment = await this.commentsRepository.save(comment);

    return createdComment.id;
  }

  async getPostIdOfComment(commentId: number): Promise<number | null> {
    const comment = await this.commentsRepository.findOneBy({ id: commentId });

    return comment?.postId || null;
  }

  async getCommentById(commentId: number) {
    return await this.commentsRepository.findOneBy({ id: commentId });
  }

  async deleteCommentById(commentId: number) {
    await this.commentsRepository.delete({ id: commentId });
  }
  async updateCommentById(content: string, commentId: number) {
    const comment = await this.commentsRepository.findOneBy({ id: commentId });

    comment.content = content;

    await this.commentsRepository.save(comment);
  }
}
