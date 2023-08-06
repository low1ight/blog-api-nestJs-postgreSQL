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

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  passwordRecoveryCode: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UserBanInfo, (b) => b.user)
  userBanInfo: UserBanInfo;

  @OneToOne(() => UserEmailConfirmation, (e) => e.user)
  userEmailConfirmation: UserBanInfo;

  @OneToMany(() => UserDevices, (d) => d.user)
  userDevices: UserDevices[];

  @OneToMany(() => Blog, (b) => b.user)
  blogs: Blog[];

  @OneToMany(() => BannedUsersForBlog, (b) => b.blog)
  bannedUserForBlog: BannedUsersForBlog;

  @OneToMany(() => PostLikes, (l) => l.post)
  postLikes: PostLikes;
}
