import { Module } from '@nestjs/common';
import { FoodplanController } from './foodplan.controller';
import { FoodPlanService } from './foodplan.service';
import { FoodPlan } from './entities/foodplan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FoodplanController],
  providers: [FoodPlanService],
  imports: [TypeOrmModule.forFeature([FoodPlan])],  
  exports: [FoodPlanService]
})
export class FoodplanModule {}