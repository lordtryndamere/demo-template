import { AggregateRoot } from '@nestjs/cqrs';
import { ReservationCreatedEvent } from 'src/reservations/application/events/reservation-created.event';
import { ReservationUpdatedEvent } from 'src/reservations/application/events/reservation-updated.event';
import { ReservationStatus } from '../enums/reservationStatus';
import { ReservationCancelledEvent } from 'src/reservations/application/events/reservation-cancelled.event';

export class Reservation extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly user_id: number,
    public readonly establishment_id: number,
    public readonly event_id: number,
    public readonly reservation_date: string,
    public readonly status?: ReservationStatus,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly notes?: string,
  ) {
    super();
  }

  create(data: {
    id: number;
    user_id: number;
    establishment_id: number;
    event_id: number;
    reservation_date: string;
    status: ReservationStatus;
    created_at: Date;
    updated_at: Date;
    notes?: string;
  }) {
    const reservation = new Reservation(
      data.id,
      data.user_id,
      data.establishment_id,
      data.event_id,
      data.reservation_date,
      data.status,
      data.created_at,
      data.updated_at,
      data.notes,
    );
    reservation.apply(
      new ReservationCreatedEvent(
        data.id,
        data.user_id,
        data.establishment_id,
        data.event_id,
        data.reservation_date,
        data.status,
        data.created_at,
        data.updated_at,
        data.notes,
      ),
    );
    return reservation;
  }

  update(data: {
    reservation_date: string;
    status: ReservationStatus;
    notes?: string;
  }) {
    if(data.status === ReservationStatus.CANCELLED){
      this.apply(
        new ReservationCancelledEvent(
          this.id,
          this.user_id,
          this.establishment_id,
          this.event_id,
          this.reservation_date,
          data.status,
          this.created_at,
          this.updated_at,
          this.notes,
        ),
      );
    }
    this.apply(
      new ReservationUpdatedEvent(
        this.id,
        this.user_id,
        this.establishment_id,
        this.event_id,
        data.reservation_date,
        data.status,
        this.created_at,
        this.updated_at,
        data.notes,
      ),
    );
  }


}
