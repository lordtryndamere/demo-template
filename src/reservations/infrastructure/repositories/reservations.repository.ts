import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationRepository } from '../../domain/repositories/reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationOrmEntity } from '../database/entities';



@Injectable()
export class TypeOrmReservationRepository implements ReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>,
  ) {}

  async save(reservation: Reservation): Promise<Reservation> {
    const reservationOrm = this.toOrmEntity(reservation);
    const savedOrm = await this.repository.save(reservationOrm);
    return this.toDomainEntity(savedOrm);
  }

  async findOneById(id: number): Promise<Reservation | null> {
    const reservationOrm = await this.repository.findOne({ where: { id } });
    if (!reservationOrm) return null;
    return this.toDomainEntity(reservationOrm);
  }

  async findAll(): Promise<Reservation[]> {
    const reservationOrms = await this.repository.find();
    return reservationOrms.map(this.toDomainEntity);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toOrmEntity(reservation: Reservation): ReservationOrmEntity {
    const ormEntity = new ReservationOrmEntity();
    ormEntity.id = reservation.id;
    ormEntity.user_id = reservation.user_id;
    ormEntity.plan_id = reservation.plan_id;
    ormEntity.start_date = reservation.start_date;
    ormEntity.end_date = reservation.end_date;
    ormEntity.status = reservation.status;
    ormEntity.notes = reservation.notes;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: ReservationOrmEntity): Reservation {
    return new Reservation(
      ormEntity.id,
      ormEntity.user_id,
      ormEntity.plan_id,
      ormEntity.place_id,
      ormEntity.start_date,
      ormEntity.end_date,
      ormEntity.status,
      ormEntity.notes,
    );
  }
}
