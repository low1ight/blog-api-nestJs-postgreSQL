import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from '../testing.service';

@Controller('testing')
export class TestingController {
  constructor(private testingService: TestingService) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllDataFromTables() {
    await this.testingService.deleteAllData();
  }
}
