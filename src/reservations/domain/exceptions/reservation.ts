import { DomainException } from "./domain";


  export class ReservationStartDateShouldBeGreaterThanNowException extends DomainException {
    constructor() {
      super(ReservationStartDateShouldBeGreaterThanNowException.getMessage());
    }
    static getMessage(): string {
      return `Reservation dates  should be greater than now`;
    }
  }


  export class ReservationAlreadyExistException extends DomainException {
    constructor() {
      super(ReservationAlreadyExistException.getMessage());
    }
    static getMessage(): string {
      return `Reservation with that time alrady exists`;
    }
  }

  export class ReservationsCancellationsAreNotAllowedLessTwentyFourHoursBefore extends DomainException {
    constructor() {
      super(ReservationsCancellationsAreNotAllowedLessTwentyFourHoursBefore.getMessage());
    }
    static getMessage(): string {
      return `Reservations cancellations are not allowed less than 24 hours before`;
    }
  }