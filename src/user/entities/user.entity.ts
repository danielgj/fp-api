import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    name: string;
    @Column('text')
    email: string;
    @Column('text')
    password: string;
    @Column({
        type: 'timestamp',
        nullable: true
    })
    lastActiveAt?: string;
    @Column('boolean')
    isPro: boolean;
    @Column('boolean')
    isAdmin: boolean;    
    @Column({
        type: 'text',
        nullable: true
    })
    avatar?: string;
}