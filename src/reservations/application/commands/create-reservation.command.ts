export class CreateReservationCommand {
    constructor(
      public readonly user_id: number,
      public readonly plan_id: number,
      public readonly place_id: number,
      public readonly start_date: Date,
      public readonly end_date: Date,
      public readonly status: string,
      public readonly notes?: string
    ) {}
  }
  