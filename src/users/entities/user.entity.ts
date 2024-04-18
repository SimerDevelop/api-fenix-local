import { Role } from 'src/roles/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    state: string;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column()
    email: string;
  
    @Column()
    idNumber: string;
  
    @Column()
    password: string;
  
    @CreateDateColumn()
    create: Date;
  
    @UpdateDateColumn()
    update: Date;
  
    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role' })
    role: Role;
}
