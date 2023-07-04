import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { DevicesPublicQueryRepository } from '../repositories/public/devices/query-repo/devices.public.query.repository';
import { RefreshTokenGuard } from '../guards/refresh.token.guard.';
import { UserDataFromRT } from '../../../../common/decorators/currentUser/UserDataFromRT';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllOtherDevicesUseCaseCommand } from '../application/public/devices/use-case/delete-all-other-devices-use-case';
import { DeleteDeviceByIdUseCaseCommand } from '../application/public/devices/use-case/delete-device-by-id-use-case';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { Exceptions } from '../../../../utils/throwException';

@Controller('security')
export class DevicePublicController {
  constructor(
    private readonly deviceQueryRepository: DevicesPublicQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}
  @Get('/devices')
  @UseGuards(RefreshTokenGuard)
  async getAllCurrentUserDevices(@CurrentUser() { userId }: UserDataFromRT) {
    return await this.deviceQueryRepository.getAllUsersByOwnerId(userId);
  }

  @Delete('/devices')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async terminateAllOtherDevicesExcludeCurrent(
    @CurrentUser() { userId, deviceId }: UserDataFromRT,
  ) {
    await this.commandBus.execute(
      new DeleteAllOtherDevicesUseCaseCommand(userId, deviceId),
    );
  }

  @Delete('/devices/:id')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async deleteDeviceById(
    @Param('id') id: number,
    @CurrentUser() { userId }: UserDataFromRT,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new DeleteDeviceByIdUseCaseCommand(id, userId),
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);
  }
}
