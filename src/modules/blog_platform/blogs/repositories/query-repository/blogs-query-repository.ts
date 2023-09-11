import { Injectable } from '@nestjs/common';
import { BlogQueryMapper } from '../../controllers/dto/query/BlogQueryMapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogSaViewModel } from '../dto/BlogSaViewModel';
import { BlogViewModel } from '../dto/BlogViewModel';
import { Paginator } from '../../../../../utils/paginatorHelpers/Paginator';
import { Blog } from '../../entity/Blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}
  async getAllUserBlogs(userId: number, mappedQuery: BlogQueryMapper) {
    const nameSearchTerm = `%${mappedQuery.getSearchNameTerm()}%`;
    const orderBy = 'blogs.' + mappedQuery.getSortBy();

    const blogs = await this.blogsRepository
      .createQueryBuilder('blogs')
      .where('blogs.ownerId = :ownerId', { ownerId: userId })
      .andWhere('blogs.name ILIKE :name', { name: nameSearchTerm })
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize())
      .offset(mappedQuery.getOffset())
      .getMany();

    const totalCount = await this.blogsRepository
      .createQueryBuilder('blogs')
      .where('blogs.ownerId = :ownerId', { ownerId: userId })
      .andWhere('blogs.name ILIKE :name', { name: nameSearchTerm })
      .getCount();

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    const blogViewModel = blogs.map((blog) => new BlogViewModel(blog));

    return paginator.paginate(blogViewModel, totalCount);
  }

  async getAllBLogForPublic(mappedQuery: BlogQueryMapper) {
    const nameSearchTerm = `%${mappedQuery.getSearchNameTerm()}%`;
    const orderBy = 'blogs.' + mappedQuery.getSortBy();

    const blogs = await this.blogsRepository
      .createQueryBuilder('blogs')
      .where('blogs.isBanned = false')
      .andWhere('blogs.name ILIKE :name', { name: nameSearchTerm })
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize())
      .offset(mappedQuery.getOffset())
      .getMany();

    const totalCount = await this.blogsRepository
      .createQueryBuilder('blogs')
      .where('blogs.isBanned = false')
      .andWhere('blogs.name ILIKE :name', { name: nameSearchTerm })
      .getCount();

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    const blogViewModel = blogs.map((blog) => new BlogViewModel(blog));

    return paginator.paginate(blogViewModel, totalCount);
  }

  async getBlogsForSa(mappedQuery: BlogQueryMapper) {
    const nameSearchTerm = `%${mappedQuery.getSearchNameTerm()}%`;
    const orderBy = 'blogs.' + mappedQuery.getSortBy();

    const blogs = await this.blogsRepository
      .createQueryBuilder('blogs')
      .leftJoinAndSelect('blogs.user', 'user')
      .where('blogs.isBanned = false')
      .andWhere('blogs.name ILIKE :name', { name: nameSearchTerm })
      .orderBy(orderBy, mappedQuery.getSortDirection())
      .limit(mappedQuery.getPageSize())
      .offset(mappedQuery.getOffset())
      .getMany();

    const totalCount = await this.blogsRepository
      .createQueryBuilder('blogs')
      .where('blogs.isBanned = false')
      .andWhere('blogs.name ILIKE :name', { name: nameSearchTerm })
      .getCount();

    const paginator = new Paginator(
      mappedQuery.getPageSize(),
      mappedQuery.getPageNumber(),
    );

    const blogsViewModel: BlogSaViewModel[] = blogs.map(
      (blog) => new BlogSaViewModel(blog),
    );

    return paginator.paginate(blogsViewModel, totalCount);
  }

  async getBlogById(blogId: number) {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    return blog ? new BlogViewModel(blog) : null;
  }

  async getBlogOwnerId(blogId: number): Promise<number | null> {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    return blog?.ownerId || null;
  }
}
