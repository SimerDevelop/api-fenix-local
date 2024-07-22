import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity ('cilindros')
export class Nif {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 50})
    nif: string;

    @Column({type: 'float'})
    category: number;

    @Column({type: 'float'})
    tara: number;

    @Column({type: 'varchar', length: 50})
    fecha_mtto: string;

    @Column()
    tiempo_mantenimiento: number;

    @Column({type: 'varchar', length: 50})
    key: Date;
}
