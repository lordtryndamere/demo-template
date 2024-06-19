export enum DomainExceptionCode {
    Default = 'DOMAIN_000001',
    ReservationStartDateShouldBeGreaterThanNowException = 'DOMAIN_000002',
    ReservationAlreadyExistException = 'DOMAIN_000003',
    ReservationsCancellationsAreNotAllowedLessTwentyFourHoursBefore = 'DOMAIN_000004'


  }
  
  export abstract class DomainException extends Error {
    constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, DomainException.prototype);
  
      this.name = DomainExceptionCode.Default;
    }
  }
  