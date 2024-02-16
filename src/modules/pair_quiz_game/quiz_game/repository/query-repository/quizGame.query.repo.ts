import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizGame } from '../../entity/QuizGame.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizGameQueryRepo {
  constructor(
    @InjectRepository(QuizGame)
    private readonly quizGameRepository: Repository<QuizGame>,
  ) {}
}
