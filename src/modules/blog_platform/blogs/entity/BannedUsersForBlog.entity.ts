import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './Blog.entity';
import { User } from '../../../users_module/users/entities/User.entity';

@Entity('BannedUsersForBlogs')
export class BannedUsersForBlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blogId: number;

  @Column()
  userId: number;

  @Column()
  banReason: string;

  @Column()
  banDate: Date;

  @ManyToOne(() => Blog, (b) => b.bannedUserForBlog, { onDelete: 'CASCADE' })
  @JoinTable()
  blog: Blog;

  @ManyToOne(() => User, (u) => u.bannedUserForBlog, { onDelete: 'CASCADE' })
  @JoinTable()
  user: User;
}
