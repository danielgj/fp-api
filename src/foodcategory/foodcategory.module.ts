import { Module } from '@nestjs/common';
import { FoodcategoryService } from './foodcategory.service';
import { FoodcategoryController } from './foodcategory.controller';

@Module({
  providers: [FoodcategoryService],
  controllers: [FoodcategoryController]
})
export class FoodcategoryModule {}
