import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { City } from "./city.entity";


@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ManyToOne(() => Country, country => country.states, {eager: true})
  country: Country;

  //* Relations
  @OneToMany(() => City, city => city.state)
  cities: City[];
}
