import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservationsQuery } from '../get-reservation.query';
import { ReservationRepository } from '../../../domain/repositories/reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { Inject } from '@nestjs/common';

@QueryHandler(GetReservationsQuery)
export class GetReservationsHandler implements IQueryHandler<GetReservationsQuery> {
    constructor(
        @Inject('ReservationRepository')
        private readonly reservationRepository: ReservationRepository) {}

  async execute(query: GetReservationsQuery): Promise<Reservation[]> {
    return this.reservationRepository.findAll();
  }
}
