import { ReservationStatus } from "src/reservations/domain/enums/reservationStatus";

export class UpdateReservationCommand {
    constructor(
      public  id: number,
      public readonly  reservation_date: string,
      public readonly status?: ReservationStatus,
      public readonly notes?: string
    ) {}
  }
  