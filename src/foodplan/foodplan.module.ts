import { Module } from '@nestjs/common';
import { FoodplanController } from './foodplan.controller';

@Module({
  imports: [],
  controllers: [FoodplanController],
})
export class FoodplanModule {}