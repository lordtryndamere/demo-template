import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReservationCommand } from '../create-reservation.command';
import { ReservationRepository } from '../../../domain/repositories/reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { Inject } from '@nestjs/common';
import { TypeOrmReservationRepository } from 'src/reservations/infrastructure/repositories/reservations.repository';

@CommandHandler(CreateReservationCommand)
export class CreateReservationHandler
  implements ICommandHandler<CreateReservationCommand>
{
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(command: CreateReservationCommand): Promise<Reservation> {
    const { user_id, plan_id, place_id, start_date, end_date, status, notes } =
      command;
    const reservation = new Reservation(
      null,
      user_id,
      plan_id,
      place_id,
      start_date,
      end_date,
      status,
      notes,
    );

    return this.reservationRepository.save(reservation);
  }
}
