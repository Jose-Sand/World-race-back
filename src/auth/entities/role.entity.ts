import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  user: User[];
}
