import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../blogs/entity/Blog.entity';
import { PostLikes } from './PostLikes.entity';
import { Comment } from '../../comments/entity/Comment.entity';

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blogId: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Blog, (p) => p.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: Blog;

  @OneToMany(() => PostLikes, (l) => l.post)
  postLikes: PostLikes[];

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];
}
