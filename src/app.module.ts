import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersSaController } from './modules/users_module/users/controllers/users.sa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './modules/users_module/users/application/users.service';
import { TestingService } from './modules/testing/testing.service';
import { TestingRepository } from './modules/testing/repositories/repository/testing.repository';
import { TestingController } from './modules/testing/controllers/testing.controller';
import {
  IsUserEmailAlreadyExist,
  IsUserLoginAlreadyExist,
} from './common/customValidators/IsUserFieldsExist';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './modules/users_module/users/application/use-cases/create-user-use-case';
import { PasswordHashAdapter } from './modules/users_module/adapters/passwordHash.adapter';
import { UsersRepo } from './modules/users_module/users/repositories/repository/users.repo';
import { DeleteUserUseCase } from './modules/users_module/users/application/use-cases/delete-user-use-case';
import { SetBanStatusForUserUseCase } from './modules/users_module/users/application/use-cases/set-ban-status-for-user-use-case';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './modules/users_module/auth/strategies/basic.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from './modules/users_module/auth/adapters/jwt.adapter';
import { AuthPublicController } from './modules/users_module/auth/controllers/auth.public.controller';
import { LocalStrategy } from './modules/users_module/auth/strategies/local.strategy';
import { LoginUseCase } from './modules/users_module/auth/application/public/auth/useCase/login-use-case';
import { AuthPublicService } from './modules/users_module/auth/application/public/auth/auth.public.service';
import { DevicePublicController } from './modules/users_module/auth/controllers/device.public.controller';
import { AccessTokenStrategy } from './modules/users_module/auth/strategies/accessToken.strategy';
import { DeviceRepo } from './modules/users_module/auth/repositories/public/devices/device.repo';
import { DevicesPublicQueryRepository } from './modules/users_module/auth/repositories/public/devices/query-repo/devices.public.query.repository';
import { RefreshTokenStrategy } from './modules/users_module/auth/strategies/refreshToken.strategy';
import { DevicesService } from './modules/users_module/auth/application/public/devices/devices.service';
import { DeleteAllOtherDevicesUseCase } from './modules/users_module/auth/application/public/devices/use-case/delete-all-other-devices-use-case';
import { DeleteDeviceByIdUseCase } from './modules/users_module/auth/application/public/devices/use-case/delete-device-by-id-use-case';
import { LogoutUseCase } from './modules/users_module/auth/application/public/auth/useCase/logout-use-case';
import { RefreshRtUseCase } from './modules/users_module/auth/application/public/auth/useCase/refresh-rt-use-case';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './adapters/email.manager';
import { UsersEmailConfirmationRepo } from './modules/users_module/users/repositories/repository/usersEmailConfirmation.repo';
import { UsersBanInfoRepo } from './modules/users_module/users/repositories/repository/usersBanInfo.repo';
import { RegisterNewUserUseCase } from './modules/users_module/auth/application/public/auth/useCase/register-new-user-use-case';
import { EmailConfirmationUseCase } from './modules/users_module/auth/application/public/auth/useCase/email-confirmation-use-case';
import { RegistrationEmailResendingUseCase } from './modules/users_module/auth/application/public/auth/useCase/registration-email-resending-use-case';
import { PasswordRecoveryUseCase } from './modules/users_module/auth/application/public/auth/useCase/password-recovery-use-case';
import { UsersQueryRepository } from './modules/users_module/users/repositories/query-repository/users.query.repository';
import { SetNewPasswordUseCase } from './modules/users_module/users/application/use-cases/set-new-password-use-case';
import { ThrottlerModule } from '@nestjs/throttler';
import { BlogsBloggerController } from './modules/blog_platform/blogs/controllers/blogs.blogger.controller';
import { CreateBlogUseCase } from './modules/blog_platform/blogs/application/use-cases/createBlogUseCase';
import { BlogsRepo } from './modules/blog_platform/blogs/repositories/repository/blogs.repo';
import { UpdateBlogUseCase } from './modules/blog_platform/blogs/application/use-cases/updateBlogUseCase';
import { DeleteBlogUseCase } from './modules/blog_platform/blogs/application/use-cases/deleteBlogUseCase';
import { PostsRepository } from './modules/blog_platform/posts/repository/posts.repository';
import { CreatePostForBlogUseCase } from './modules/blog_platform/posts/application/use-cases/createPostForBlogUseCase';
import { PostsQueryRepository } from './modules/blog_platform/posts/repository/posts-query-repository.service';
import { UpdatePostForBlogUseCase } from './modules/blog_platform/posts/application/use-cases/updatePostUseCase';
import { DeletePostForBlogUseCase } from './modules/blog_platform/posts/application/use-cases/deletePostUseCase';
import { BlogsQueryRepository } from './modules/blog_platform/blogs/repositories/query-repository/blogs-query-repository';
import { BannedUsersForBlogRepo } from './modules/users_module/users/repositories/repository/bannedUsersForBlogs.repo';
import { UsersBloggerController } from './modules/users_module/users/controllers/users.blogger.controller';
import { BanUserForBlogUseCase } from './modules/blog_platform/blogs/application/use-cases/banUserForBlogUseCase';
import { BannedUsersForBlogsQueryRepository } from './modules/users_module/users/repositories/query-repository/bannedUsersForBlogs.query.repository';
import { BindBlogUseCase } from './modules/blog_platform/blogs/application/bindBlogUseCase';
import { BlogsSaController } from './modules/blog_platform/blogs/controllers/blogs.sa.controller';
import { PostsPublicController } from './modules/blog_platform/posts/controllers/posts.public.controller';
import { BanBlogUseCase } from './modules/blog_platform/blogs/application/use-cases/banBlogUseCase';
import { BlogsPublicController } from './modules/blog_platform/blogs/controllers/blogs.public.controller';
import { CreateCommentForPostUseCase } from './modules/blog_platform/comments/application/use-cases/createCommentForPostUseCase';
import { CommentsRepository } from './modules/blog_platform/comments/repositories/repository/comments.repository';
import { BlogsService } from './modules/blog_platform/blogs/application/blogs.service';
import { CommentsQueryRepository } from './modules/blog_platform/comments/repositories/query-repository/comments.query.repository';
import { PostsLikesRepository } from './modules/blog_platform/posts/repository/postsLikes.repository';
import { SetLikeStatusForPostUseCase } from './modules/blog_platform/posts/application/use-cases/setLikeStatusForPostUseCase';
import { CommentLikesRepo } from './modules/blog_platform/comments/repositories/repository/commentLikes.repo';
import { SerLikeStatusForCommentUseCase } from './modules/blog_platform/comments/application/use-cases/serLikeStatusForCommentUseCase';
import { CommentsPublicController } from './modules/blog_platform/comments/controllers/comments.public.controller';
import { DeleteCommentForPostUseCase } from './modules/blog_platform/comments/application/use-cases/deleteCommentForPostUseCase';
import { UpdateCommentUseCase } from './modules/blog_platform/comments/application/use-cases/updateCommentUseCase';

import { UserBanInfo } from './modules/users_module/users/entities/UserBanInfo.entity';
import { User } from './modules/users_module/users/entities/User.entity';
import { UserDevices } from './modules/users_module/users/entities/UserDevices.entity';
import { UserEmailConfirmation } from './modules/users_module/users/entities/UserEmailConfirmation.entity';
import { Blog } from './modules/blog_platform/blogs/entity/Blog.entity';
import { BannedUsersForBlog } from './modules/blog_platform/blogs/entity/BannedUsersForBlog.entity';
import { PostLikes } from './modules/blog_platform/posts/entity/PostLikes.entity';
import { Post } from './modules/blog_platform/posts/entity/Post.entity';
import { Comment } from './modules/blog_platform/comments/entity/Comment.entity';
import { CommentLikes } from './modules/blog_platform/comments/entity/CommentLikes.entity';

const customValidators = [IsUserLoginAlreadyExist, IsUserEmailAlreadyExist];
const useCases = [
  DeleteAllOtherDevicesUseCase,
  CreateUserUseCase,
  BanBlogUseCase,
  DeleteUserUseCase,
  RegisterNewUserUseCase,
  DeletePostForBlogUseCase,
  RefreshRtUseCase,
  UpdateCommentUseCase,
  CreateCommentForPostUseCase,
  UpdateBlogUseCase,
  SetBanStatusForUserUseCase,
  BanUserForBlogUseCase,
  SerLikeStatusForCommentUseCase,
  BindBlogUseCase,
  LogoutUseCase,
  SetNewPasswordUseCase,
  LoginUseCase,
  PasswordRecoveryUseCase,
  DeleteCommentForPostUseCase,
  EmailConfirmationUseCase,
  CreatePostForBlogUseCase,
  RegistrationEmailResendingUseCase,
  DeleteDeviceByIdUseCase,
  CreateBlogUseCase,
  SetLikeStatusForPostUseCase,
  UpdatePostForBlogUseCase,
  DeleteBlogUseCase,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-plain-sky-717396-pooler.eu-central-1.aws.neon.tech',
      port: 5432,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: 'Blog-db',
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        ssl: true,
      },
    }),
    TypeOrmModule.forFeature([
      User,
      UserBanInfo,
      UserDevices,
      UserEmailConfirmation,
      Blog,
      BannedUsersForBlog,
      Post,
      PostLikes,
      Comment,
      CommentLikes,
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    CqrsModule,
    PassportModule,
    ThrottlerModule.forRoot({}),
  ],
  controllers: [
    AppController,
    UsersSaController,
    DevicePublicController,
    TestingController,
    PostsPublicController,
    AuthPublicController,
    BlogsPublicController,
    BlogsBloggerController,
    CommentsPublicController,
    BlogsSaController,
    UsersBloggerController,
  ],
  providers: [
    BasicStrategy,
    EmailManager,
    AppService,
    UsersEmailConfirmationRepo,
    UsersBanInfoRepo,
    LocalStrategy,
    CommentsRepository,
    UsersQueryRepository,
    UsersService,
    BlogsService,
    PostsLikesRepository,
    AccessTokenStrategy,
    CommentsQueryRepository,
    PostsRepository,
    TestingService,
    BlogsRepo,
    DeviceRepo,
    DevicesPublicQueryRepository,
    CommentLikesRepo,
    JwtAdapter,
    PostsQueryRepository,
    BlogsQueryRepository,
    PasswordHashAdapter,
    TestingRepository,
    BannedUsersForBlogRepo,
    UsersRepo,
    AuthPublicService,
    BannedUsersForBlogsQueryRepository,
    RefreshTokenStrategy,
    DevicesService,
    ...customValidators,
    ...useCases,

    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
