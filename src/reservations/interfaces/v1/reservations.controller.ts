import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReservationCommand } from '../../application/commands/create-reservation.command';
import { GetReservationsQuery } from '../../application/queries/get-reservation.query';
import { Reservation } from '../../domain/entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createReservationDto: any): Promise<Reservation> {
    const { userId, planId, startDate, endDate, status, notes } = createReservationDto;
    return this.commandBus.execute(
      new CreateReservationCommand(userId, planId, startDate, endDate, status, notes),
    );
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.queryBus.execute(new GetReservationsQuery());
  }
}
