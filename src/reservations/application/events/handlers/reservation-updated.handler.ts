import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RabbitMQEventPublisherImplement } from 'src/reservations/infrastructure/message/rabbitMQ-event-publisher';
import { IntegrationEventPublisher } from 'src/reservations/infrastructure/message/integration-event-publisher';
import { IntegrationEventSubject } from '../integration-event-subject';
import { ReservationUpdatedEvent } from '../reservation-updated.event';

@EventsHandler(ReservationUpdatedEvent)
export class ReservationUpdatedHandler
  implements IEventHandler<ReservationUpdatedEvent>
{
  constructor(
    @Inject(RabbitMQEventPublisherImplement)
    private readonly rabbitMQService: IntegrationEventPublisher,
  ) {}

  async handle(event: ReservationUpdatedEvent) {
    await this.rabbitMQService.publish({
      subject: IntegrationEventSubject.RESERVATION_UPDATED,
      data: {
        ...event,
        eventType: IntegrationEventSubject.RESERVATION_UPDATED,
      },
    });
  }
}
