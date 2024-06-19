import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReservationCommand } from '../create-reservation.command';
import { ReservationRepository } from '../../../domain/repositories/reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import {
  ReservationAlreadyExistException,
  ReservationStartDateShouldBeGreaterThanNowException,
} from 'src/reservations/domain/exceptions/reservation';
import {
  ESTABLISMENT_MICROSERVICE_URL,
  RESERVATION_REPOSITORY,
} from 'src/reservations/domain/constants/inject-constants';
import { HttpCommunication } from 'src/reservations/infrastructure/message/externals/http-communication';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from 'src/reservations/infrastructure/message/integration-event-publisher';
import { ConfigService } from '@nestjs/config';
import {
  GetEstablishmentsResponse,
  OpeningHours,
} from 'src/reservations/infrastructure/responses/get-establishments.response';
import { TypeOrmReservationRepository } from 'src/reservations/infrastructure/repositories/reservations.repository';

@CommandHandler(CreateReservationCommand)
export class CreateReservationHandler
  implements ICommandHandler<CreateReservationCommand>
{
  constructor(
    @Inject(TypeOrmReservationRepository)
    private readonly reservationRepository: ReservationRepository,
    @Inject(HttpCommunication)
    private readonly httpService: IntegrationEventPublisher,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  static validateAndParseDate(dateString: string): Date {
    const dateFormat = 'DD-MM-YYYY H:mm'; // Define el formato de fecha personalizado
    const date = moment(dateString, dateFormat, true);
    if (!date.isValid()) {
      throw new BadRequestException('Invalid date format');
    }
    return date.toDate();
  }
  public async getEstablishment(establishmentId: number) {
    const url = this.configService
      .get<string>(ESTABLISMENT_MICROSERVICE_URL)
      .concat('/establishments/' + establishmentId);
    this.logger.log(url);
    const record: IntegrationEvent = {
      subject: 'establishment',
      data: {
        url,
        headers: {},
      },
    };
    return (await this.httpService.publish(
      record,
    )) as GetEstablishmentsResponse;
  }

  public async isWithinOperatingHours(
    day: OpeningHours,
    reservationDate: moment.Moment,
  ) {
    const momentRange = extendMoment(moment);
    const inputHour = reservationDate.format('HH:mm');

    const openingTime = moment(day.open_time, 'HH:mm');
    const closingTime = moment(day.close_time, 'HH:mm');
    const inputMoment = moment(inputHour, 'HH:mm');

    const range = momentRange.range(openingTime, closingTime);

    return range.contains(inputMoment);
  }
  public async validateDay(
    establishment: GetEstablishmentsResponse,
    reservationDate: moment.Moment,
  ) {
    return establishment.opening_hours.find(
      (schedule) => schedule.day_of_week === reservationDate.day(),
    );
  }

  private readonly logger = new Logger(CreateReservationHandler.name);

  async execute(command: CreateReservationCommand): Promise<Reservation> {
    try {
      this.logger.log('CreateReservationCommand');
      const {
        user_id,
        establishment_id,
        event_id,
        reservation_date,
        status,
        notes,
      } = command;

      const establishment = await this.getEstablishment(establishment_id);
      if (!establishment) {
        throw new BadRequestException('Establishment not found.');
      }
      const record =
        await this.reservationRepository.findByReservationDateAndUserId(
          user_id,
          reservation_date,
          establishment_id,
        );
      const now = moment(new Date());
      const reservationDate = moment(
        CreateReservationHandler.validateAndParseDate(reservation_date),
      );
      const day = await this.validateDay(establishment, reservationDate);
      if (!day) {
        throw new BadRequestException(
          'The establishment is closed on the selected day.',
        );
      }
      const isWithinOperatingHours = await this.isWithinOperatingHours(
        day,
        reservationDate,
      );
      if (!isWithinOperatingHours) {
        throw new BadRequestException(
          'The reservation date must be within the operating hours.',
        );
      }
      if (record) throw new ReservationAlreadyExistException();

      if (reservationDate.isBefore(now)) {
        throw new ReservationStartDateShouldBeGreaterThanNowException();
      }
      if (reservationDate.isAfter(now.add(1, 'month'))) {
        throw new BadRequestException(
          'The reservation date must be within the next month.',
        );
      }
      //reservation capacity
      const reservationsCount =
        await this.reservationRepository.countReservations(
          establishment_id,
          reservation_date,
        );
      if (
        reservationsCount >=
        establishment.reservation_capacities.max_reservations
      ) {
        throw new BadRequestException(
          'The establishment is fully booked for the selected time..',
        );
      }

      this.logger.log('Reservation created');

      const reservation = new Reservation(
        null,
        user_id,
        establishment_id,
        event_id,
        reservation_date,
        status,
        new Date(),
        new Date(),
        notes,
      );

      return this.reservationRepository.save(reservation);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
