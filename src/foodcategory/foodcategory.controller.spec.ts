import { Test, TestingModule } from '@nestjs/testing';
import { FoodcategoryController } from './foodcategory.controller';

describe('FoodcategoryController', () => {
  let controller: FoodcategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodcategoryController],
    }).compile();

    controller = module.get<FoodcategoryController>(FoodcategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
