import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../../../adapters/jwt.adapter';
import { DevicesPublicRepository } from '../../../../repositories/public/devices/devices.public.repository';
import { v4 as uuidv4 } from 'uuid';
export class RefreshRtUseCaseCommand {
  constructor(
    public userId: number,
    public deviceId: number,
    public login: string,
  ) {}
}

@CommandHandler(RefreshRtUseCaseCommand)
export class RefreshRtUseCase
  implements ICommandHandler<RefreshRtUseCaseCommand>
{
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly devicesRepository: DevicesPublicRepository,
  ) {}

  async execute({ userId, deviceId, login }: RefreshRtUseCaseCommand) {
    const sessionId = uuidv4();

    await this.devicesRepository.updateSessionId(sessionId, deviceId);

    return await this.jwtAdapter.createJwtTokens(
      userId,
      login,
      deviceId,
      sessionId,
    );
  }
}
