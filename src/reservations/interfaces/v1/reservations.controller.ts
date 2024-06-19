import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReservationCommand } from '../../application/commands/create-reservation.command';
import { GetReservationsQuery } from '../../application/queries/get-reservation.query';
import { Reservation } from '../../domain/entities/reservation.entity';
import { UpdateReservationDto } from 'src/reservations/infrastructure/dto/update-reservation.dto';
import { UpdateReservationCommand } from 'src/reservations/application/commands/update-reservation.command';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createReservationDto: any): Promise<Reservation> {
    const { user_id, establishment_id ,event_id, reservation_date, status, notes } = createReservationDto;
    return this.commandBus.execute(
      new CreateReservationCommand(user_id, establishment_id ,event_id, reservation_date, status, notes),
    );
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.queryBus.execute(new GetReservationsQuery());
  }
  @Put(':id')
  async updateReservation(
    @Param('id') id: number,
    @Body() {reservation_date,status,notes}: UpdateReservationDto
  ) {
    return this.commandBus.execute(
      new UpdateReservationCommand(id,reservation_date,status,notes),
    );
  }
}
