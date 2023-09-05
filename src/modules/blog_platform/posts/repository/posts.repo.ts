import { Injectable } from '@nestjs/common';
import { CreatePostForBlogDto } from '../../blogs/controllers/dto/createPostForBlogDto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdatePostDto } from '../../blogs/controllers/dto/UpdatePostDto';
import { Post } from '../entity/Post.entity';

@Injectable()
export class PostsRepo {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async createPost(
    blogId: number,
    { title, shortDescription, content }: CreatePostForBlogDto,
  ): Promise<number> {
    const post = new Post();

    post.blogId = blogId;
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.createdAt = new Date();

    const createdPost = await this.postsRepository.save(post);

    return createdPost.id;
  }

  async updatePost(
    postId: number,
    { title, content, shortDescription }: UpdatePostDto,
  ) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    post.title = title;
    post.content = content;
    post.shortDescription = shortDescription;

    await this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    await this.postsRepository.delete({ id: postId });
  }

  async getPostDataWithBlogOwnerId(postId: number) {
    const result = await this.dataSource.query(
      `
    SELECT *,
    (SELECT "ownerId" FROM "Blogs" WHERE "id" = p."blogId")
    FROM "Posts" p
    WHERE "id" = $1
    
    `,
      [postId],
    );

    return result[0] ? result[0] : null;
  }

  async getPostBlogId(postId: number): Promise<number | null> {
    const post = await this.postsRepository.findOneBy({ id: postId });

    return post?.blogId || null;
  }
}
