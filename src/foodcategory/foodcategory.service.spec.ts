import { Test, TestingModule } from '@nestjs/testing';
import { FoodcategoryService } from './foodcategory.service';

describe('FoodcategoryService', () => {
  let service: FoodcategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodcategoryService],
    }).compile();

    service = module.get<FoodcategoryService>(FoodcategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
