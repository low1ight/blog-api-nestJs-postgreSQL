import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../../adapters/jwt.adapter';
import { v4 as uuidv4 } from 'uuid';
import { DevicesPublicRepository } from '../../../repositories/public/devices/devices.public.repository';

export class LoginUseCaseCommand {
  constructor(public id, public login, public title, public ip) {}
}
@CommandHandler(LoginUseCaseCommand)
export class LoginUseCase implements ICommandHandler<LoginUseCaseCommand> {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly devicesRepository: DevicesPublicRepository,
  ) {}
  async execute({ id, login, title, ip }: LoginUseCaseCommand) {
    const sessionId = uuidv4();
    //create device for this login session and return created device id
    const createdDeviceId = await this.devicesRepository.createDevice(
      id,
      ip,
      title,
      sessionId,
    );

    return await this.jwtAdapter.createJwtTokens(
      id,
      login,
      createdDeviceId,
      sessionId,
    );
  }
}
