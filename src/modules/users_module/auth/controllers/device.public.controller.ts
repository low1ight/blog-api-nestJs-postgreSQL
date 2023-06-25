import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/currentUser/current.user.decorator';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { CurrentUserType } from '../../../../common/decorators/currentUser/CurrentUserType';
import { DevicesPublicQueryRepository } from '../repositories/public/devices/query-repo/devices.public.query.repository';

@Controller('security')
export class DevicePublicController {
  constructor(
    private readonly deviceQueryRepository: DevicesPublicQueryRepository,
  ) {}
  @Get('devices')
  @UseGuards(JwtAuthGuard)
  async getAllCurrentUserDevices(@CurrentUser() { id }: CurrentUserType) {
    return await this.deviceQueryRepository.getAllUsersByOwnerId(id);
  }
}
