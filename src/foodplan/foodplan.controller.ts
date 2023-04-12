import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Admin } from '../auth/decorators/admin.decorator';
import { FoodPlanService } from './foodplan.service';
import { FoodPlan } from './entities/foodplan.entity';
import { CreateFoodPlanDTO } from './dtos/createFoodPlan.dto';

@Controller('foodplan')
export class FoodplanController {

    constructor(
        private foodPlansService: FoodPlanService
    ) {}

    @Admin()
    @Get()
    async findAllPlans(): Promise<FoodPlan[]> {
        return this.foodPlansService.findAllPlans();
    }

    @Post()
    async createPlan(@Body() plan: CreateFoodPlanDTO, @Req() request): Promise<FoodPlan> {
        console.log(`user: ${JSON.stringify(request.user)}`);
        return this.foodPlansService.createPlan(plan, request?.user);
    }

}