import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { State } from "./state.entity";
import { User } from "src/auth/entities/user.entity";

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ManyToOne(() => State, state => state.cities)
  state: State;

  //* Relations
  @OneToMany(()=> User, user => user.city)
  users: User[];
}
