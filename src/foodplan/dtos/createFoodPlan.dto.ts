import { IsDate, IsEmail, IsString } from "class-validator";

export class CreateFoodPlanDTO {
    @IsString()
    name: string;
}