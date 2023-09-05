import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../../controllers/dto/CreateBlogDto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogViewModel } from '../dto/BlogViewModel';
import { UpdateBlogDto } from '../../controllers/dto/UpdateBlogDto';
import { Blog } from '../../entity/Blog.entity';

@Injectable()
export class BlogsRepo {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blog) protected blogsRepository: Repository<Blog>,
  ) {}

  async createBlog({
    ownerId,
    name,
    description,
    websiteUrl,
    isMembership,
  }: CreateBlogDto): Promise<BlogViewModel> {
    const blog = new Blog();

    blog.ownerId = ownerId;
    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.isMembership = isMembership;
    blog.createdAt = new Date();

    const createdBlog = await this.blogsRepository.save(blog);

    return new BlogViewModel(createdBlog);
  }

  async getBlogById(blogId: number) {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    return blog || null;
  }

  async updateBlog(
    blogId: number,
    { name, description, websiteUrl }: UpdateBlogDto,
  ) {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;

    await this.blogsRepository.save(blog);
  }

  async deleteBlogById(blogId: number) {
    await this.blogsRepository.delete({ id: blogId });
  }

  async getBlogOwnerId(blogId: number): Promise<number | null> {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    return blog?.ownerId || null;
  }

  async bindUserForBlog(blogId: number, userId: number) {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    blog.ownerId = userId;
    await this.blogsRepository.save(blog);
  }

  async getBlogBanStatusById(blogId: number) {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    return blog || null;
  }

  async setBanStatusForBlog(banStatus: boolean, blogId: number) {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });
    blog.isBanned = banStatus;
    blog.banDate = banStatus ? new Date() : null;

    await this.blogsRepository.save(blog);
  }
}
