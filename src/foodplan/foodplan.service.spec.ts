import { Test, TestingModule } from '@nestjs/testing';
import { FoodPlanService } from './foodplan.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FoodPlan } from './entities/foodplan.entity';
import { FoodPlanMockData } from '../mock/foodplan.mock';
import { PlanNotFoundError } from './errors/planNotFound.error';
import { CreateFoodPlanDTO } from './dtos/createFoodPlan.dto';
import { User } from '../user/entities/user.entity';
import { UserMockData } from '../mock/user.mock';

describe('FoodPlanService', () => {
  let foodPlanService: FoodPlanService;
  let foodplanRepo: Repository<FoodPlan>;

  const token = 'validtoken';
  const mockedSignUpResponse = {
    access_token: token,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodPlanService,
        {
          provide: getRepositoryToken(FoodPlan),
          useValue: {
            find: jest.fn().mockResolvedValue(FoodPlanMockData.plans),
            findOneBy: jest.fn().mockImplementation((query) => {
              if (query.id) {
                return FoodPlanMockData.plans.find(
                  (item) => item.id == query.id,
                );
              }
              return null;
            }),
            save: jest.fn().mockImplementation((input) => input),
            create: jest.fn().mockImplementation((input) => {
              return {
                id: 'foo-id',
                ...input,
              };
            }),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(token),
          },
        },
      ],
    }).compile();

    foodPlanService = module.get<FoodPlanService>(FoodPlanService);
    foodplanRepo = module.get<Repository<FoodPlan>>(
      getRepositoryToken(FoodPlan),
    );
  });

  it('should be defined', () => {
    expect(foodPlanService).toBeDefined();
  });

  it('findAllPlans return an array of plans', async () => {
    const result = await foodPlanService.findAllPlans();
    expect(result).toBe(FoodPlanMockData.plans);
  });

  it('findPlanById with valid Id returns expected entry', async () => {
    const result = await foodPlanService.findPlanById(
      FoodPlanMockData.plans[0].id,
    );
    expect(result).toBe(FoodPlanMockData.plans[0]);
  });

  it('findPlanById with invalid Id thwos error', async () => {
    await expect(foodPlanService.findPlanById('wrong')).rejects.toThrow(
      PlanNotFoundError,
    );
  });

  it('Create a new plan returns expected', async () => {
    const createFoodPlanDTO: CreateFoodPlanDTO = {
      name: 'testplan',
    };
    const user: User = UserMockData.users[0];
    const createdPlan = await foodPlanService.createPlan(
      createFoodPlanDTO,
      user,
    );
    expect(createdPlan).toEqual({
      id: 'foo-id',
      owner: user.id,
      name: createFoodPlanDTO.name,
      isActive: true,
      createdAt: expect.any(String),
    });
  });
});
