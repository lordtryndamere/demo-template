import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReservationRepository } from '../../../domain/repositories/reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { Inject } from '@nestjs/common';
import * as moment from 'moment';
import { UpdateReservationCommand } from '../update-reservation.command';
import { FindReservationByIdDatabaseException } from 'src/reservations/infrastructure/exceptions/exceptions';
import { ReservationStatus } from 'src/reservations/domain/enums/reservationStatus';
import { CreateReservationHandler } from './create-reservation.handler';
import { ReservationsCancellationsAreNotAllowedLessTwentyFourHoursBefore } from 'src/reservations/domain/exceptions/reservation';
import { TypeOrmReservationRepository } from 'src/reservations/infrastructure/repositories/reservations.repository';

@CommandHandler(UpdateReservationCommand)
export class UpdateReservationHandler
  implements ICommandHandler<UpdateReservationCommand>
{
  constructor(
    @Inject(TypeOrmReservationRepository)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(command: UpdateReservationCommand): Promise<Reservation> {
    const { id } =
      command;
      const reservation = await this.reservationRepository.findOneById(id);
      if (!reservation) {
        throw new FindReservationByIdDatabaseException();
      }
      const reservationDate = moment(
        CreateReservationHandler.validateAndParseDate(reservation.reservation_date),
      );
      const now = moment(new Date());
      //handle reservation cancellations
      if(command.status === ReservationStatus.CANCELLED){
        const hoursDiff = now.diff(reservationDate, 'hours');
        if(hoursDiff < 24){
          throw new ReservationsCancellationsAreNotAllowedLessTwentyFourHoursBefore();
        }
        
      }
      
    return this.reservationRepository.updateReservation(id,command);
  }
}
