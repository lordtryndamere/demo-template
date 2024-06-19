import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationRepository } from '../../domain/repositories/reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationOrmEntity } from '../database/entities';
import { EventPublisher } from '@nestjs/cqrs';
import { ReservationStatus } from 'src/reservations/domain/enums/reservationStatus';

@Injectable()
export class TypeOrmReservationRepository implements ReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>,
    private readonly publisher: EventPublisher,
  ) {}  

  async save(reservation: Reservation): Promise<Reservation> {
    const reservationOrm = this.toOrmEntity(reservation);

    const savedOrm = await this.repository.save(reservationOrm);
    let reservationDomain = this.toDomainEntity(savedOrm);

    reservationDomain = this.publisher.mergeObjectContext(
      reservationDomain.create({
        id: reservationDomain.id,
        user_id: reservationDomain.user_id,
        establishment_id: reservationDomain.establishment_id,
        event_id: reservationDomain.event_id,
        reservation_date: reservationDomain.reservation_date,
        status: reservationDomain.status,
        created_at: reservationDomain.created_at,
        updated_at: reservationDomain.updated_at,
        notes: reservationDomain.notes,
      }),
    );
    reservationDomain.commit();
    return reservationDomain;
  }

  async findOneById(id: number): Promise<Reservation | null> {
    const reservationOrm = await this.repository.findOne({ where: { id } });
    if (!reservationOrm) return null;
    return this.toDomainEntity(reservationOrm);
  }

  async findAll(): Promise<Reservation[]> {
    const reservationOrms = await this.repository.find({
      where: { status: ReservationStatus.ACTIVE },
    });
    return reservationOrms.map(this.toDomainEntity);
  }
  async findByReservationDateAndUserId(
    user_id: number,
    reservation_date: string,
    establishment_id: number,
  ): Promise<Reservation | null> {
    const reservationOrm = await this.repository.findOneBy({
      user_id,
      reservation_date,
      establishment_id,
    });
    return this.toDomainEntity(reservationOrm);
  }
  async countReservations(establishment_id: number, reservation_date: string) {
    return await this.repository.count({
      where: { establishment_id, reservation_date },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
  async updateReservation(
    id: number,
    data: Partial<Reservation>,
  ): Promise<Reservation> {
    const reservationEntity = await this.repository.findOneByOrFail({ id });

    const updatedReservationEntity = this.repository.merge(
      reservationEntity,
      {
        reservation_date: data.reservation_date,
        status: data.status,
        notes: data.notes,
      },
      {
        updated_at: new Date(),
      },
    );
    await this.repository.save(updatedReservationEntity);
    let reservation = this.publisher.mergeObjectContext(
      new Reservation(
        updatedReservationEntity.id,
        updatedReservationEntity.user_id,
        updatedReservationEntity.establishment_id,
        updatedReservationEntity.event_id,
        updatedReservationEntity.reservation_date,
        updatedReservationEntity.status,
        updatedReservationEntity.created_at,
        updatedReservationEntity.updated_at,
        updatedReservationEntity.notes,
      ),
    );

    reservation.update({
      reservation_date: reservation.reservation_date,
      status: reservation.status,
      notes: reservation.notes,
    });
    reservation.commit();
    return reservation;
  }

  private toOrmEntity(reservation: Reservation): ReservationOrmEntity {
    const ormEntity = new ReservationOrmEntity();
    ormEntity.id = reservation.id;
    ormEntity.user_id = reservation.user_id;
    ormEntity.establishment_id = reservation.establishment_id;
    ormEntity.event_id = reservation.event_id;
    ormEntity.reservation_date = reservation.reservation_date;
    ormEntity.status = reservation.status;
    ormEntity.notes = reservation.notes;
    ormEntity.created_at = reservation.created_at;
    ormEntity.updated_at = reservation.updated_at;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: ReservationOrmEntity): Reservation {
    return new Reservation(
      ormEntity.id,
      ormEntity.user_id,
      ormEntity.establishment_id,
      ormEntity.event_id,
      ormEntity.reservation_date,
      ormEntity.status,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.notes,
    );
  }
}
