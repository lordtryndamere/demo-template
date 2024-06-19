import { IEvent } from '@nestjs/cqrs';
import { ReservationStatus } from 'src/reservations/domain/enums/reservationStatus';
export class ReservationCancelledEvent implements IEvent {
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
    ) {}
  }