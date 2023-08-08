import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users_module/users/entities/User.entity';
import { BannedUsersForBlog } from './BannedUsersForBlog.entity';
import { Post } from '../../posts/entity/Post.entity';

@Entity('Blogs')
export class Blog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ownerId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  isMembership: boolean;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true, default: null })
  banDate: boolean;

  @ManyToOne(() => User, (u) => u.blogs, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => BannedUsersForBlog, (b) => b.blog)
  bannedUserForBlog: BannedUsersForBlog;

  @OneToMany(() => Post, (p) => p.blog)
  posts: Post[];
}
