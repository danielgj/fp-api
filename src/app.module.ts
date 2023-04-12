import { Module } from '@nestjs/common';
import { FoodplanModule } from './foodplan/foodplan.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FoodcategoryModule } from './foodcategory/foodcategory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true // Disable in prod
    }),
    UserModule,
    AuthModule,
    FoodplanModule,
    FoodcategoryModule    
  ],
})
export class AppModule {}
