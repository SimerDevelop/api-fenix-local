import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity ('datos')
export class Data {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100})
    admin: string;

    @Column({type: 'varchar', length: 50})
    id_admin: string;

    @Column({type: 'varchar', length: 100})
    operario: string;

    @Column({type: 'varchar', length: 50})
    id_operario: string;

    @Column({type: 'varchar', length: 3})
    id_bascula: string;

    @Column({type: 'timestamp'})
    fecha: Date;

    @Column({type: 'varchar', length: 50})
    nif: string;

    @Column({type: 'float'})
    capacidad: number;

    @Column({type: 'float'})
    tara: number;

    @Column({type: 'float'})
    peso_inicial: number;

    @Column({type: 'float'})
    peso_final: number;

    @Column({type: 'float'})
    masa_aplicada: number;

    @Column({type: 'varchar', length: 5})
    estado: string;

    @Column({type: 'varchar', length: 25})
    sucursal: string;
}
