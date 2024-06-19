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
import { RabbitMQEventPublisherImplement } from './infrastructure/message/rabbitMQ-event-publisher';
import { ReservationCreatedHandler } from './application/events/handlers/reservation-created.handler';
import { ReservationUpdatedHandler } from './application/events/handlers/reservation-updated.handler';
import { UpdateReservationHandler } from './application/commands/handlers/update-reservation.handler';
import { ReservationCancellHandler } from './application/events/handlers/reservation-cancelled.handler';
import { HttpCommunication } from './infrastructure/message/externals/http-communication';
import { RESERVATION_REPOSITORY } from './domain/constants/inject-constants';
const infrastructure = [
  RabbitMQEventPublisherImplement,
  HttpCommunication,
  TypeOrmReservationRepository,
];
const application = [
  CreateReservationHandler,
  UpdateReservationHandler,
  GetReservationsHandler,
  ReservationCreatedHandler,
  ReservationUpdatedHandler,
  ReservationCancellHandler,
];
const domain = [];
@Module({
  controllers: [ReservationsController],
  imports: [
    TypeOrmModule.forFeature([ReservationOrmEntity]),
    CqrsModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class ReservationsModule {}
