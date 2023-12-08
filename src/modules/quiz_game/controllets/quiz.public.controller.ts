import { Controller, Get } from '@nestjs/common';

@Controller('pair-game-quiz/pairs')
export class QuizPublicController {
  @Get('my-current')
  getCurrentUnfinishedGame() {
    return;
  }
}
