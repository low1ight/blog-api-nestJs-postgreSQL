import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentLikeDbModel } from '../dto/CommentLikeDbModel';
import { CommentLikes } from '../../entity/CommentLikes.entity';

@Injectable()
export class CommentLikesRepo {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(CommentLikes)
    private commentLikesRepository: Repository<CommentLikes>,
  ) {}

  async getUserLikeForComment(
    userId: number,
    commentId: number,
  ): Promise<CommentLikeDbModel | null> {
    return await this.commentLikesRepository.findOneBy({
      commentId,
      userId,
    });
  }

  async createLikeForComment(
    commentId: number,
    userId: number,
    likeStatus: string,
  ) {
    const commentLike = new CommentLikes();

    commentLike.commentId = commentId;
    commentLike.userId = userId;
    commentLike.likeStatus = likeStatus;
    commentLike.createdAt = new Date();

    await this.commentLikesRepository.save(commentLike);
  }

  async updateLikeStatusForComment(
    commentId: number,
    userId: number,
    likeStatus: string,
  ) {
    const commentLike = await this.commentLikesRepository.findOneBy({
      commentId,
      userId,
    });

    commentLike.likeStatus = likeStatus;
    commentLike.createdAt = new Date();
    await this.commentLikesRepository.save(commentLike);
  }

  async deleteLikeForComment(commentId: number, userId: number) {
    await this.commentLikesRepository.delete({ commentId, userId });
  }
}
