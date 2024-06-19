import { Test, TestingModule } from '@nestjs/testing';
import { HttpCommunication } from 'src/reservations/infrastructure/message/externals/http-communication';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { InternalServerErrorException, Logger } from '@nestjs/common';
import { GetEstablishmentsResponse } from 'src/reservations/infrastructure/responses/get-establishments.response';
import { Reservation } from 'src/reservations/domain/entities/reservation.entity';
import { CreateReservationCommand } from 'src/reservations/application/commands/create-reservation.command';
import { CreateReservationHandler } from 'src/reservations/application/commands/handlers/create-reservation.handler';
import { TypeOrmReservationRepository } from 'src/reservations/infrastructure/repositories/reservations.repository';
import { ReservationStatus } from 'src/reservations/domain/enums/reservationStatus';


describe('CreateReservationHandler', () => {
  let handler: CreateReservationHandler;
  let reservationRepository: TypeOrmReservationRepository;
  let httpService: HttpCommunication;
  let configService: ConfigService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReservationHandler,
        {
          provide: TypeOrmReservationRepository,
          useValue: {
            findOne: jest.fn(),
            findByReservationDateAndUserId: jest.fn(),
            countReservations: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HttpCommunication,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    handler = module.get<CreateReservationHandler>(CreateReservationHandler);
    reservationRepository = module.get<TypeOrmReservationRepository>(TypeOrmReservationRepository);
    httpService = module.get<HttpCommunication>(HttpCommunication);
    configService = module.get<ConfigService>(ConfigService);
  });
  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should create a reservation successfully', async () => {
      const command = new CreateReservationCommand(
        1,
        2,
        3,
        '31-05-2024 12:00',
        ReservationStatus.ACTIVE,
        'Test note',
      );
      const establishmentResponse: GetEstablishmentsResponse = {
        id: 2,
        name: 'Test Establishment',
        opening_hours: [
          {
            id: 1,
            establishment_id: 2,
            day_of_week: 0,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 2,
            establishment_id: 2,
            day_of_week: 1,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 3,
            establishment_id: 2,
            day_of_week: 2,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 4,
            establishment_id: 2,
            day_of_week: 3,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 5,
            establishment_id: 2,
            day_of_week: 4,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 6,
            establishment_id: 2,
            day_of_week: 5,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 7,
            establishment_id: 2,
            day_of_week: 6,
            open_time: '08:00',
            close_time: '20:00',
          },
        ],
        reservation_capacities: {
          max_reservations: 10,
          id: 0,
          establishment_id: 0,
          reservation_interval: 0,
        },
        address: '',
        category: '',
        phone: '',
        email: '',
        description: '',
        image: '',
        admin_id: 0,
      };
      const createReservationDto = {
        user_id: 1,
        establishment_id: 2,
        event_id: 3,
        reservation_date: '31-05-2024 12:00',
        status: ReservationStatus.ACTIVE,
        notes: 'Test note',
      };
      const reservation = new Reservation(
        null,
        createReservationDto.user_id,
        createReservationDto.establishment_id,
        createReservationDto.event_id,
        createReservationDto.reservation_date,
        createReservationDto.status,
        new Date(),
        new Date(),
        createReservationDto.notes,
      );

      jest
        .spyOn(handler, 'getEstablishment')
        .mockResolvedValue(establishmentResponse);
      jest
        .spyOn(reservationRepository, 'findByReservationDateAndUserId')
        .mockResolvedValue(null);
      jest.spyOn(reservationRepository, 'save').mockResolvedValue(reservation);
      jest
        .spyOn(reservationRepository, 'countReservations')
        .mockResolvedValue(0);

      expect(await handler.execute(command)).toBe(reservation);
    });

    it('should throw an error if establishment is fully booked', async () => {
      const command = new CreateReservationCommand(
        1,
        2,
        3,
        '31-05-2024 12:00',
        ReservationStatus.ACTIVE,
        'Test note',
      );
      const establishmentResponse: GetEstablishmentsResponse = {
        id: 2,
        name: 'Test Establishment',
        opening_hours: [
          {
            id: 1,
            establishment_id: 2,
            day_of_week: 0,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 2,
            establishment_id: 2,
            day_of_week: 1,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 3,
            establishment_id: 2,
            day_of_week: 2,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 4,
            establishment_id: 2,
            day_of_week: 3,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 5,
            establishment_id: 2,
            day_of_week: 4,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 6,
            establishment_id: 2,
            day_of_week: 5,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 7,
            establishment_id: 2,
            day_of_week: 6,
            open_time: '08:00',
            close_time: '20:00',
          },
        ],
        reservation_capacities: {
          max_reservations: 10,
          id: 0,
          establishment_id: 0,
          reservation_interval: 0,
        },
        address: '',
        category: '',
        phone: '',
        email: '',
        description: '',
        image: '',
        admin_id: 0,
      };

      jest
        .spyOn(handler, 'getEstablishment')
        .mockResolvedValue(establishmentResponse);
      jest
        .spyOn(reservationRepository, 'findByReservationDateAndUserId')
        .mockResolvedValue(null);
      jest
        .spyOn(reservationRepository, 'countReservations')
        .mockResolvedValue(10);

      await expect(handler.execute(command)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an error if reservation already exists', async () => {
      const command = new CreateReservationCommand(
        1,
        2,
        3,
        '31-05-2024 12:00',
        ReservationStatus.ACTIVE,
        'Test note',
      );
      const establishmentResponse: GetEstablishmentsResponse = {
        id: 2,
        name: 'Test Establishment',
        opening_hours: [
          {
            id: 1,
            establishment_id: 2,
            day_of_week: 0,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 2,
            establishment_id: 2,
            day_of_week: 1,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 3,
            establishment_id: 2,
            day_of_week: 2,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 4,
            establishment_id: 2,
            day_of_week: 3,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 5,
            establishment_id: 2,
            day_of_week: 4,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 6,
            establishment_id: 2,
            day_of_week: 5,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 7,
            establishment_id: 2,
            day_of_week: 6,
            open_time: '08:00',
            close_time: '20:00',
          },
        ],
        reservation_capacities: {
          max_reservations: 10,
          id: 0,
          establishment_id: 0,
          reservation_interval: 0,
        },
        address: '',
        category: '',
        phone: '',
        email: '',
        description: '',
        image: '',
        admin_id: 0,
      };
      const createReservationDto = {
        user_id: 1,
        establishment_id: 2,
        event_id: 3,
        reservation_date: '31-05-2024 12:00',
        status: ReservationStatus.ACTIVE,
        notes: 'Test note',
      };

      jest.spyOn(handler, 'getEstablishment').mockResolvedValue(establishmentResponse);
      jest
        .spyOn(reservationRepository, 'findByReservationDateAndUserId')
        .mockResolvedValue(
          new Reservation(
            null,
            createReservationDto.user_id,
            createReservationDto.establishment_id,
            createReservationDto.event_id,
            createReservationDto.reservation_date,
            createReservationDto.status,
            new Date(),
            new Date(),
            createReservationDto.notes,
          ),
        );

      await expect(handler.execute(command)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an error if reservation date is in the past', async () => {
      const command = new CreateReservationCommand(
        1,
        2,
        3,
        '01-01-2020 12:00',
        ReservationStatus.ACTIVE,
        'Test note',
      );
      const establishmentResponse: GetEstablishmentsResponse = {
        id: 2,
        name: 'Test Establishment',
        opening_hours: [
          {
            id: 1,
            establishment_id: 2,
            day_of_week: 0,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 2,
            establishment_id: 2,
            day_of_week: 1,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 3,
            establishment_id: 2,
            day_of_week: 2,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 4,
            establishment_id: 2,
            day_of_week: 3,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 5,
            establishment_id: 2,
            day_of_week: 4,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 6,
            establishment_id: 2,
            day_of_week: 5,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 7,
            establishment_id: 2,
            day_of_week: 6,
            open_time: '08:00',
            close_time: '20:00',
          },
        ],
        reservation_capacities: {
          max_reservations: 10,
          id: 0,
          establishment_id: 0,
          reservation_interval: 0,
        },
        address: '',
        category: '',
        phone: '',
        email: '',
        description: '',
        image: '',
        admin_id: 0,
      };

      jest.spyOn(handler, 'getEstablishment').mockResolvedValue(establishmentResponse);
      jest
        .spyOn(reservationRepository, 'findByReservationDateAndUserId')
        .mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
    it('should throw an error if reservation date is so much in the future', async () => {
      const command = new CreateReservationCommand(
        1,
        2,
        3,
        '07-12-2025 12:00',
        ReservationStatus.ACTIVE,
        'Test note',
      );
      const establishmentResponse: GetEstablishmentsResponse = {
        id: 2,
        name: 'Test Establishment',
        opening_hours: [
          {
            id: 1,
            establishment_id: 2,
            day_of_week: 0,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 2,
            establishment_id: 2,
            day_of_week: 1,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 3,
            establishment_id: 2,
            day_of_week: 2,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 4,
            establishment_id: 2,
            day_of_week: 3,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 5,
            establishment_id: 2,
            day_of_week: 4,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 6,
            establishment_id: 2,
            day_of_week: 5,
            open_time: '08:00',
            close_time: '20:00',
          },
          {
            id: 7,
            establishment_id: 2,
            day_of_week: 6,
            open_time: '08:00',
            close_time: '20:00',
          },
        ],
        reservation_capacities: {
          max_reservations: 10,
          id: 0,
          establishment_id: 0,
          reservation_interval: 0,
        },
        address: '',
        category: '',
        phone: '',
        email: '',
        description: '',
        image: '',
        admin_id: 0,
      };

      jest.spyOn(handler, 'getEstablishment').mockResolvedValue(establishmentResponse);
      jest
        .spyOn(reservationRepository, 'findByReservationDateAndUserId')
        .mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
    it('should throw an error if selected day is not valid', async () => {
      const command = new CreateReservationCommand(
        1,
        2,
        3,
        '07-12-2025 12:00',
        ReservationStatus.ACTIVE,
        'Test note',
      );
      const establishmentResponse: GetEstablishmentsResponse = {
        id: 2,
        name: 'Test Establishment',
        opening_hours: [
          {
            id: 1,
            establishment_id: 2,
            day_of_week: 0,
            open_time: '08:00',
            close_time: '20:00',
          },
        ],
        reservation_capacities: {
          max_reservations: 10,
          id: 0,
          establishment_id: 0,
          reservation_interval: 0,
        },
        address: '',
        category: '',
        phone: '',
        email: '',
        description: '',
        image: '',
        admin_id: 0,
      };

      jest.spyOn(handler, 'getEstablishment').mockResolvedValue(establishmentResponse);
      jest
        .spyOn(reservationRepository, 'findByReservationDateAndUserId')
        .mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
