import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FoodPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text')
  owner: string;
  @Column('timestamp')
  createdAt?: string;
  @Column('boolean')
  isActive: boolean;
}
