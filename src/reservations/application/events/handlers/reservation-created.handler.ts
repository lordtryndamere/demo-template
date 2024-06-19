import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservationCreatedEvent } from '../reservation-created.event';
import { Inject } from '@nestjs/common';
import { RabbitMQEventPublisherImplement } from 'src/reservations/infrastructure/message/rabbitMQ-event-publisher';
import { IntegrationEventPublisher } from 'src/reservations/infrastructure/message/integration-event-publisher';
import { IntegrationEventSubject } from '../integration-event-subject';

@EventsHandler(ReservationCreatedEvent)
export class ReservationCreatedHandler
  implements IEventHandler<ReservationCreatedEvent>
{
  constructor(
    @Inject(RabbitMQEventPublisherImplement)
    private readonly rabbitMQService: IntegrationEventPublisher,
  ) {}

  async handle(event: ReservationCreatedEvent) {
    await this.rabbitMQService.publish({
      subject: IntegrationEventSubject.RESERVATION_CREATED,
      data: {
        ...event,
        eventType: IntegrationEventSubject.RESERVATION_CREATED,
      },
    });
  }
}
