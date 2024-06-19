import {  IsDateString, IsString, IsOptional } from 'class-validator';
import { ReservationStatus } from 'src/reservations/domain/enums/reservationStatus';

export class UpdateReservationDto {



  @IsOptional()
  reservation_date: string;

  @IsOptional()
  @IsString()
  status: ReservationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
