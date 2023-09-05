import { SetLikeStatusForPostDto } from '../controllers/dto/SetLikeStatusForPostDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PostLikes } from '../entity/PostLikes.entity';
@Injectable()
export class PostsLikesRepo {
  constructor(
    @InjectRepository(PostLikes)
    private postLikesRepository: Repository<PostLikes>,
  ) {}
  async createUserLikeForPost(
    { likeStatus }: SetLikeStatusForPostDto,
    postId: number,
    userId: number,
  ) {
    const postLike = new PostLikes();

    postLike.postId = postId;
    postLike.userId = userId;
    postLike.likeStatus = likeStatus;
    postLike.createdAt = new Date();

    await this.postLikesRepository.save(postLike);
  }

  async getLike(postId: number, userId: number) {
    return await this.postLikesRepository.findOneBy({ postId, userId });
  }

  async updateLikeStatusById(
    postId: number,
    userId: number,
    { likeStatus }: SetLikeStatusForPostDto,
  ) {
    const postLike = await this.postLikesRepository.findOneBy({
      postId,
      userId,
    });

    postLike.likeStatus = likeStatus;
    postLike.createdAt = new Date();

    await this.postLikesRepository.save(postLike);
  }

  async deleteLikeForPost(postId: number, userId: number) {
    await this.postLikesRepository.delete({ postId, userId });
  }
}
