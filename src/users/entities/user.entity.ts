import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @Column({nullable: false})
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    daletedAt: Date;



}
