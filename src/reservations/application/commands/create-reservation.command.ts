import { ReservationStatus } from "src/reservations/domain/enums/reservationStatus";

export class CreateReservationCommand {
    constructor(
      public readonly user_id: number,
      public readonly establishment_id: number,
      public readonly event_id: number,
      public readonly reservation_date: string,
      public readonly status?: ReservationStatus,
      public readonly notes?: string,
    ) {}
  }
  