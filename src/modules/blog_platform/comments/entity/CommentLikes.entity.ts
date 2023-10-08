import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users_module/users/entities/User.entity';
import { Comment } from './Comment.entity';

@Entity('CommentsLikes')
export class CommentLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commentId: number;

  @Column()
  userId: number;

  @Column()
  likeStatus: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Comment, (p) => p.commentLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => User, (u) => u.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
