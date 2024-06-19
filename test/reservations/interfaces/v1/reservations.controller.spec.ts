import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateReservationCommand } from 'src/reservations/application/commands/update-reservation.command';
import { Reservation } from '../../../../src/reservations/domain/entities/reservation.entity';
import { UpdateReservationDto } from 'src/reservations/infrastructure/dto/update-reservation.dto';
import { ReservationsController } from 'src/reservations/interfaces/v1/reservations.controller';
import { CreateReservationCommand } from 'src/reservations/application/commands/create-reservation.command';
import { GetReservationsQuery } from 'src/reservations/application/queries/get-reservation.query';
import { ReservationStatus } from 'src/reservations/domain/enums/reservationStatus';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should execute CreateReservationCommand', async () => {
      const createReservationDto = {
        user_id: 1,
        establishment_id: 2,
        event_id: 3,
        reservation_date: '2023-01-01T00:00:00Z',
        status: ReservationStatus.ACTIVE,
        notes: 'Test note',
      };
      const result = new Reservation(
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

      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      expect(await controller.create(createReservationDto)).toBe(result);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateReservationCommand(
          createReservationDto.user_id,
          createReservationDto.establishment_id,
          createReservationDto.event_id,
          createReservationDto.reservation_date,
          createReservationDto.status,
          createReservationDto.notes,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should execute GetReservationsQuery', async () => {
      const createReservationDto = {
        user_id: 1,
        establishment_id: 2,
        event_id: 3,
        reservation_date: '2023-01-01T00:00:00Z',
        status: ReservationStatus.ACTIVE,
        notes: 'Test note',
      };

      const result = [
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
      ];

      jest.spyOn(queryBus, 'execute').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetReservationsQuery());
    });
  });

  describe('updateReservation', () => {
    it('should execute UpdateReservationCommand', async () => {
      const createReservationDto = {
        user_id: 1,
        establishment_id: 2,
        event_id: 3,
        reservation_date: '2023-01-01T00:00:00Z',
        status: ReservationStatus.ACTIVE,
        notes: 'Test note',
      };
      const updateReservationDto: UpdateReservationDto = {
        reservation_date: '2023-01-01T00:00:00Z',
        status: ReservationStatus.CANCELLED,
        notes: 'Updated note',
      };
      const result = new Reservation(
        null,
        createReservationDto.user_id,
        createReservationDto.establishment_id,
        createReservationDto.event_id,
        updateReservationDto.reservation_date,
        updateReservationDto.status,
        new Date(),
        new Date(),
        updateReservationDto.notes,
      );

      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      expect(await controller.updateReservation(1, updateReservationDto)).toBe(
        result,
      );
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateReservationCommand(
          1,
          updateReservationDto.reservation_date,
          updateReservationDto.status,
          updateReservationDto.notes,
        ),
      );
    });
  });
});
