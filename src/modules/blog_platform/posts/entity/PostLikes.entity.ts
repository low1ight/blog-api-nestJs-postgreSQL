import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post.entity';
import { User } from '../../../users_module/users/entities/User.entity';

@Entity('PostsLikes')
export class PostLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  likeStatus: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Post, (p) => p.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (u) => u.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
