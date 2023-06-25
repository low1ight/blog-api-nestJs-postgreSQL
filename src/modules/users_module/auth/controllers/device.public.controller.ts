import { Controller, Delete, Get, HttpCode, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserDataFromAT } from '../../../../common/decorators/currentUser/UserDataFromAT';
import { DevicesPublicQueryRepository } from '../repositories/public/devices/query-repo/devices.public.query.repository';
import { RefreshTokenGuard } from '../guards/refresh.token.guard.';
import { UserDataFromRT } from '../../../../common/decorators/currentUser/UserDataFromRT';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllOtherDevicesCommand } from '../application/public/devices/use-case/delete-all-other-devices';

@Controller('security/devices')
export class DevicePublicController {
  constructor(
    private readonly deviceQueryRepository: DevicesPublicQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCurrentUserDevices(@CurrentUser() { id }: UserDataFromAT) {
    return await this.deviceQueryRepository.getAllUsersByOwnerId(id);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async terminateAllOtherDevicesExcludeCurrent(
    @CurrentUser() { userId, deviceId }: UserDataFromRT,
  ) {
    await this.commandBus.execute(
      new DeleteAllOtherDevicesCommand(userId, deviceId),
    );
  }
}
