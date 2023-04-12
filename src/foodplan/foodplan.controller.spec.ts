import { Test, TestingModule } from '@nestjs/testing';
import { FoodplanController } from './foodplan.controller';
import { FoodPlanService } from './foodplan.service';
import { FoodPlanMockData } from '../mock/foodplan.mock';
import { PlanNotFoundError } from './errors/planNotFound.error';
import { CreateFoodPlanDTO } from './dtos/createFoodPlan.dto';
import { User } from '../user/entities/user.entity';

describe('FoodplanController', () => {
  let foodplanController: FoodplanController;

  const req = {
    user: {
        id: '#user1'
    }
  };
  const createPlanDTO: CreateFoodPlanDTO = {
    name: "test",        
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [FoodplanController],
      providers: [
        {
            provide: FoodPlanService,
            useValue: {
              findAllPlans: jest.fn().mockResolvedValue(FoodPlanMockData.plans),
              findPlanById: jest.fn().mockImplementation((id: string) => {
                const plan = FoodPlanMockData.plans.find((item) => item.id == id);
                if (!plan) {
                    throw new PlanNotFoundError(id);
                }
                return plan;
              }),
              createPlan: jest.fn().mockImplementation((plan: CreateFoodPlanDTO, user: User) => {
                return {
                    owner: user.id,
                    name: plan.name,
                    isActive: true,
                    createdAt: new Date().toISOString()
                };
              }),
            }
        }        
      ]
    }).compile();

    foodplanController = moduleRef.get<FoodplanController>(FoodplanController);
  });

  it('should be defined', () => {
    expect(foodplanController).toBeDefined();
  });

  it('Find all retrieves all plans', async () => {
    await expect(foodplanController.findAllPlans()).resolves.toBe(FoodPlanMockData.plans);

  });

  it('Create plan returns data', async () => {
    await expect(foodplanController.createPlan(createPlanDTO, req)).resolves.toBeDefined();
  });

  it('Create plan assigng owner', async () => {
    const out = await foodplanController.createPlan(createPlanDTO, req);
    expect(out.owner).toBe(req.user.id);
  });

});