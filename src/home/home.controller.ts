import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('')
export class HomeController {
  @Public()
  @Get()
  healthCheck(): string {
    return 'Food Planner API Up and Running';
  }
}
