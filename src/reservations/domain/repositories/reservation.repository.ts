import { Reservation } from '../entities/reservation.entity';

export interface ReservationRepository {
  save(reservation: Reservation): Promise<Reservation>;
  findOneById(id: number): Promise<Reservation | null>;
  findByReservationDateAndUserId(
    user_id: number,
    reservation_date: string,
    establishment_id: number,
  ): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  deleteById(id: number): Promise<void>;
  updateReservation(
    id: number,
    data: Partial<Reservation>,
  ): Promise<Reservation>;

  countReservations(
    establishment_id: number,
    reservation_date: string,
  ): Promise<number>;
}
