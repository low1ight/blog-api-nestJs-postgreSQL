import { Controller, Delete } from '@nestjs/common';
import { TestingService } from '../testing.service';

@Controller('testing')
export class TestingController {
  constructor(private testingService: TestingService) {}
  @Delete('all-data')
  async deleteAllDataFromTables() {
    await this.testingService.deleteAllData();
  }
}
