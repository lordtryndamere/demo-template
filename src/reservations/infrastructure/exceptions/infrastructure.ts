export enum InfrastructureExceptionCode {
    Default = 'DEFAULT_INFRA_EXCEPTION',
  
    SaveReservationDatabaseException = 'SAVE_RESERVATION_DATABASE_EXCEPTION',
    UpdateReservationStatusDatabaseException = 'UPDATE_RESERVATION_STATUS_DATABASE_EXCEPTION',
    FindReservationByIdDatabaseException = 'FIND_RESERVATION_BY_ID_DATABASE_EXCEPTION',
    FindAllReservationsDatabaseException = 'FIND_ALL_RESERVATIONS_DATABASE_EXCEPTION',

  }
  export abstract class InfrastructureException extends Error {
    code: string;
  
    constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, InfrastructureException.prototype);
  
      this.code = InfrastructureExceptionCode.Default;
    }
  }
  