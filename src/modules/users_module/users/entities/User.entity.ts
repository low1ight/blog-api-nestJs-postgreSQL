import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBanInfo } from './UserBanInfo.entity';
import { UserDevices } from './UserDevices.entity';
import { UserEmailConfirmation } from './UserEmailConfirmation.entity';
import { Blog } from '../../../blog_platform/blogs/entity/Blog.entity';
import { BannedUsersForBlog } from '../../../blog_platform/blogs/entity/BannedUsersForBlog.entity';
import { PostLikes } from '../../../blog_platform/posts/entity/PostLikes.entity';
import { Comment } from '../../../blog_platform/comments/entity/Comment.entity';
import { CommentLikes } from '../../../blog_platform/comments/entity/CommentLikes.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: null, nullable: true })
  passwordRecoveryCode: string;

  @Column()
  email: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => UserBanInfo, (b) => b.user)
  userBanInfo: UserBanInfo;

  @OneToOne(() => UserEmailConfirmation, (e) => e.user)
  userEmailConfirmation: UserEmailConfirmation;

  @OneToMany(() => UserDevices, (d) => d.user)
  userDevices: UserDevices[];

  @OneToMany(() => Blog, (b) => b.user)
  blogs: Blog[];

  @OneToMany(() => BannedUsersForBlog, (b) => b.user)
  bannedUserForBlog: BannedUsersForBlog;

  @OneToMany(() => PostLikes, (l) => l.user)
  postLikes: PostLikes;

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  @OneToMany(() => CommentLikes, (l) => l.user)
  commentLikes: CommentLikes;
}
