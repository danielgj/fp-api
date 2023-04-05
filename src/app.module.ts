import { Module } from '@nestjs/common';
import { FoodplanModule } from './foodplan/foodplan.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    FoodplanModule
  ],
})
export class AppModule {}
