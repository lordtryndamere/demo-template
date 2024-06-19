export class GetEstablishmentsResponse {
  readonly name: string;

  readonly address: string;

  readonly category: string;

  readonly phone: string;

  readonly email: string;

  readonly description: string;

  readonly image: string;

  readonly id: number;

  readonly admin_id: number;

  readonly opening_hours: OpeningHours[];

  readonly reservation_capacities: ReservationCapacities;

  readonly created_at?: Date;

  readonly updated_at?: Date;
}

export class OpeningHours {
  readonly id: number;

  readonly establishment_id: number;

  readonly day_of_week: number;

  readonly open_time: string;

  readonly close_time: string;

  readonly created_at?: Date;

  readonly updated_at?: Date;
}

export class ReservationCapacities {
  readonly id: number;

  readonly establishment_id: number;

  readonly max_reservations: number;

  readonly reservation_interval: number;

  readonly created_at?: Date;

  readonly updated_at?: Date;
}
