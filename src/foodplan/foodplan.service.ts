import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FoodPlan } from "./entities/foodplan.entity";
import { PlanNotFoundError } from "./errors/planNotFound.error";
import { CreateFoodPlanDTO } from "./dtos/createFoodPlan.dto";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class FoodPlanService {

    constructor(
        @InjectRepository(FoodPlan)private readonly foodPlansRepository: Repository<FoodPlan>
    ) {}

    
    async findAllPlans(): Promise<FoodPlan[]> {
        return await this.foodPlansRepository.find();
    }

    async findPlanById(id: string):Promise<FoodPlan> {
        const plan = await this.foodPlansRepository.findOneBy({id});
        if (!plan) {
            throw new PlanNotFoundError(id);
        }
        return plan;
    }
    
    async createPlan(plan: CreateFoodPlanDTO, user: User): Promise<FoodPlan> {

        const now = new Date().toISOString();
        
        var newPLan = this.foodPlansRepository.create({
            owner: user.id,
            name: plan.name,
            isActive: true,
            createdAt: now
        });
        await this.foodPlansRepository.save(newPLan);
        return newPLan;
    }
}