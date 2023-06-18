import { Injectable } from '@nestjs/common';
import { TestingRepository } from './repositories/repository/testing.repository';

@Injectable()
export class TestingService {
  constructor(private testingRepository: TestingRepository) {}

  async deleteAllData() {
    return await this.testingRepository.deleteAllData();
  }
}
