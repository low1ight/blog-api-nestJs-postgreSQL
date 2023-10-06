import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users_module/users/entities/User.entity';
import { Post } from '../../posts/entity/Post.entity';
import { CommentLikes } from './CommentLikes.entity';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  content: string;

  @Column()
  ownerId: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  user: User;

  @ManyToOne(() => Post, (p) => p.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @OneToMany(() => CommentLikes, (p) => p.comment)
  commentLikes: CommentLikes[];
}
