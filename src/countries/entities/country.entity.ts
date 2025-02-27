import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { State } from "./state.entity";
import { Payment } from "src/payments/entities/payment.entity";

@Entity('countries')
export class Country {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  sortname: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  phonecode: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  amount: number;

  //* Relations
  @OneToMany(() => State, state => state.country)
  states: State[];

  @OneToMany(()=> Payment, payment => payment.country)
  payments: Payment[];
}
