import { DeviceDbType } from '../../dto/Device.db.type';

export class DeviceViewModel {
  public deviceId: string;
  public ip: string;
  public lastActiveDate: string;
  public title: string;

  constructor({ ip, id, lastActiveDate, title }: DeviceDbType) {
    this.title = title;
    this.lastActiveDate = lastActiveDate.toISOString();
    this.ip = ip;
    this.deviceId = id;
  }
}
