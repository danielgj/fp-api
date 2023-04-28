import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('')
export class HomeController {
  @Public()
  @Get()
  getUpAndRunning(): string {
    return 'Food Planner API Up and Running';
  }
}
