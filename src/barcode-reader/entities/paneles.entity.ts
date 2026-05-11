import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('paneles')
export class Panel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tracker: string;

    @Column()
    panel: string;

    @Column()
    parque: string;

    @Column()
    creadoPor: string;
};