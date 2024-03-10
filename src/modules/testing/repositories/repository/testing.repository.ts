import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async deleteAllData() {
    await this.dataSource.query(`
    DO
$do$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE 'DELETE FROM ' || quote_ident(r.tablename) || ';';
    END LOOP;
END
$do$;
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
