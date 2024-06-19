import { Reservation } from '../entities/reservation.entity';

export interface ReservationRepository {
  save(reservation: Reservation): Promise<Reservation>;
  findOneById(id: number): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  deleteById(id: number): Promise<void>;
}
