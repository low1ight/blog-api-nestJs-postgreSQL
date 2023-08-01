import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentInputDto } from '../../controllers/dto/UpdateCommentInputDto';
import { CommentsRepository } from '../../repositories/repository/comments.repository';
import { CustomResponse } from '../../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../../utils/customResponse/CustomResponseEnum';

export class UpdateCommentUseCaseCommand {
  constructor(
    public dto: UpdateCommentInputDto,
    public currentUserId: number,
    public commentId: number,
  ) {}
}
@CommandHandler(UpdateCommentUseCaseCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentUseCaseCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({
    dto,
    commentId,
    currentUserId,
  }: UpdateCommentUseCaseCommand) {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (comment.ownerId !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.commentsRepository.updateCommentById(dto.content, commentId);
  }
}
