import { UserDevices } from '../../../../../../users/entities/UserDevices.entity';

export class DeviceViewModel {
  public deviceId: string;
  public ip: string;
  public lastActiveDate: string;
  public title: string;

  constructor({ ip, id, lastActiveDate, title }: UserDevices) {
    this.title = title;
    this.lastActiveDate = lastActiveDate.toISOString();
    this.ip = ip;
    this.deviceId = id.toString();
  }
}
