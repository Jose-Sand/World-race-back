import { User } from "src/auth/entities/user.entity";
import { Country } from "src/countries/entities/country.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({
    type: 'numeric',
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 4,
    nullable: false,
  })
  currency: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  stripePriceId: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  stripeSessionId: string;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @ManyToOne(() => Country, (country) => country.payments)
  country: Country;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'declined'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'declined';

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at' })
  deletedAt: Date;

}
