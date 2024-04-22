import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    id_tipo_usuario: number;

    @Column({ type: 'varchar', length: 255 })
    usuario: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;

    @Column({ type: 'varchar', length: 255 })
    apellido: string;

    @Column({ type: 'varchar', length: 255 })
    identificacion: string;

    @Column({ type: 'int' })
    id_estado: number;

    @Column({ type: 'varchar', length: 255 })
    flag: string;
    
}

















