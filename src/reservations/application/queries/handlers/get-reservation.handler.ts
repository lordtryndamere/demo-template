import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservationsQuery } from '../get-reservation.query';
import { ReservationRepository } from '../../../domain/repositories/reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { Inject } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import {Redis} from 'ioredis';
import { TypeOrmReservationRepository } from 'src/reservations/infrastructure/repositories/reservations.repository';
//TODO:FindByUserId query create

@QueryHandler(GetReservationsQuery)
export class GetReservationsHandler
  implements IQueryHandler<GetReservationsQuery>
{
  constructor(
    @Inject(TypeOrmReservationRepository)
    private readonly reservationRepository: ReservationRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(query: GetReservationsQuery): Promise<Reservation[]> {
    const cacheKey = 'reservations_all';
    const cachedReservations = await this.redis.get(cacheKey); 

    if (cachedReservations) {     
      return JSON.parse(cachedReservations);
    }
    const reservations = await this.reservationRepository.findAll(); ///
    
    await this.redis.set(cacheKey, JSON.stringify(reservations), 'EX', 3600); // save here
    return reservations;
  }
}
