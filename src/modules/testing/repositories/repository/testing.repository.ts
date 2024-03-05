import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async deleteAllData() {
    await this.dataSource.query(`
        DELETE FROM "Blogs";
        DELETE FROM "Users";
          
    

    `);
  }

  async deleteQuizGames() {
    await this.dataSource.query(`
        DELETE FROM "QuizGamePlayersAnswers";
        DELETE FROM "QuizGamesQuestions";
        DELETE FROM "QuizGames";
          
    

    `);
  }
}
