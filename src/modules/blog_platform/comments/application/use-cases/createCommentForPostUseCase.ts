import { CreateCommentInputDto } from '../../controllers/dto/CreateCommentInputDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CommentsRepository } from '../../repositories/repository/comments.repository';
import { BlogsService } from '../../../blogs/application/blogs.service';

export class CreateCommentForPostUseCaseCommand {
  constructor(
    public dto: CreateCommentInputDto,
    public ownerId: number,
    public postId: number,
  ) {}
}
@CommandHandler(CreateCommentForPostUseCaseCommand)
export class CreateCommentForPostUseCase
  implements ICommandHandler<CreateCommentForPostUseCaseCommand>
{
  constructor(
    private readonly blogsService: BlogsService,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto, postId, ownerId }: CreateCommentForPostUseCaseCommand) {
    const validationResult =
      await this.blogsService.validateBanDataBeforeAction(postId, ownerId);

    if (!validationResult.isSuccess) return validationResult;

    const createdCommentId = await this.commentsRepository.createCommentForPost(
      postId,
      ownerId,
      dto,
    );

    return new CustomResponse(true, null, createdCommentId);
  }
}
