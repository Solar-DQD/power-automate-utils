import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('paneles')
export class Panel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tracker: string;

    @Column({ unique: true })
    panel: string;

    @Column()
    parque: string;
};