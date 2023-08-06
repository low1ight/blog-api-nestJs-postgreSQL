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
  createdAt: number;

  @ManyToOne(() => Blog, (p) => p.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: Blog;

  @OneToMany(() => PostLikes, (l) => l.post)
  postLikes: PostLikes;
}
