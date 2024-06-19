import { InfrastructureException, InfrastructureExceptionCode } from "./infrastructure";

export class SaveReservationDatabaseException extends InfrastructureException{
    constructor(
      message = 'There was an error in the database when reservation was saved',
    ) {
      super(message);
      Object.setPrototypeOf(this, SaveReservationDatabaseException.prototype);
  
      this.code =
        InfrastructureExceptionCode.SaveReservationDatabaseException.toString();
    }
  }


  export class UpdateReservationStatusDatabaseException extends InfrastructureException{
    constructor(
      message = 'There was an error in the database when reservation was updated',
    ) {
      super(message);
      Object.setPrototypeOf(this, UpdateReservationStatusDatabaseException.prototype);
  
      this.code =
        InfrastructureExceptionCode.UpdateReservationStatusDatabaseException.toString();
    }
  }


  export class FindReservationByIdDatabaseException extends InfrastructureException{
    constructor(
      message = 'There was an error in the database getting reservation by identifier',
    ) {
      super(message);
      Object.setPrototypeOf(this, FindReservationByIdDatabaseException.prototype);
  
      this.code =
        InfrastructureExceptionCode.FindReservationByIdDatabaseException.toString();
    }
  }