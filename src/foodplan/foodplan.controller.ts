import { Controller, Get } from '@nestjs/common';
import { Foodplan } from './model/Foodplan';

@Controller('foodplan')
export class FoodplanController {

    private plans: Foodplan[] = [
        {
            description: 'Lulidan plan',
            status: 'in-progress'
        },
        {
            description: 'Otro plan',
            status: 'closed'
        }
    ];

    @Get()
    findAllPlans(): Foodplan[] {
        return this.plans;
    }

}