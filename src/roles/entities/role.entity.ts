import { Permission } from 'src/permissions/entities/permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    state: string;
  
    @ManyToMany(() => Permission, { cascade: true }) 
    @JoinTable() 
    permissions: Permission[];
  
    @CreateDateColumn()
    create: Date;
  
    @UpdateDateColumn()
    update: Date;
}
