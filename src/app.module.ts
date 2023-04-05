import { Module } from '@nestjs/common';
import { FoodplanModule } from './foodplan/foodplan.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    FoodplanModule
  ],
})
export class AppModule {}
