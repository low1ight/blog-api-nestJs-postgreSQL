import { LikeForPostViewModel } from './LikeForPostViewModel';
import { Post } from '../../entity/Post.entity';
import { Blog } from '../../../blogs/entity/Blog.entity';

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: LikeForPostViewModel[];
  };
  constructor(dto: Post & { blog: Blog }) {
    this.id = dto.id.toString();
    this.title = dto.title;
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.blogId = dto.blog.id.toString() || 'no name';
    this.blogName = dto.blog.name || 'no name';
    this.createdAt = dto.createdAt;
    this.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
  }
}

// export class PostViewModel {
//   id: string;
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
//   blogName: string;
//   createdAt: Date;
//   extendedLikesInfo: {
//     likesCount: number;
//     dislikesCount: number;
//     myStatus: string;
//     newestLikes: LikeForPostViewModel[];
//   };
//   constructor({
//                 id,
//                 title,
//                 content,
//                 shortDescription,
//                 blogId,
//                 blogName,
//                 createdAt,
//                 totalLikesCount,
//                 totalDislikesCount,
//                 myStatus,
//               }: PostsWithBlogDataAndLikesRaw) {
//     this.id = id.toString();
//     this.title = title;
//     this.content = content;
//     this.shortDescription = shortDescription;
//     this.blogId = blogId.toString();
//     this.blogName = blogName;
//     this.createdAt = createdAt;
//     this.extendedLikesInfo = {
//       likesCount: Number(totalLikesCount),
//       dislikesCount: Number(totalDislikesCount),
//       myStatus: myStatus || 'None',
//       newestLikes: [],
//     };
//   }
// }
