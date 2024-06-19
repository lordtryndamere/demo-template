import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReservationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number; 

  @Column()
  plan_id: number; 

  @Column()
  place_id: number; 

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  notes: string;
}
