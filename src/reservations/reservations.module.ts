import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateReservationHandler } from './application/commands/handlers/create-reservation.handler';
import { GetReservationsHandler } from './application/queries/handlers/get-reservation.handler';
import { ReservationOrmEntity } from './infrastructure/database/entities';
import { TypeOrmReservationRepository } from './infrastructure/repositories/reservations.repository';
import { ReservationsController } from './interfaces/v1/reservations.controller';
import { ConfigModule } from '@nestjs/config';


const infrastructure = [];
const application = [CreateReservationHandler,GetReservationsHandler];
const domain = [];
@Module({
  controllers:[ReservationsController],
  imports: [
    TypeOrmModule.forFeature([ReservationOrmEntity]),
    CqrsModule,
    HttpModule,
    ConfigModule
  ],
  providers: [
    ...infrastructure,
    ...application,
    ...domain,
    {
      provide: 'ReservationRepository',
      useClass: TypeOrmReservationRepository,
    },
  ],
})
export class ReservationsModule {}
