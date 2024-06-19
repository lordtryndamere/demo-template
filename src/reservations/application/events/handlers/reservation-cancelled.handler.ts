import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RabbitMQEventPublisherImplement } from 'src/reservations/infrastructure/message/rabbitMQ-event-publisher';
import { IntegrationEventPublisher } from 'src/reservations/infrastructure/message/integration-event-publisher';
import { IntegrationEventSubject } from '../integration-event-subject';
import { ReservationCancelledEvent } from '../reservation-cancelled.event';

@EventsHandler(ReservationCancelledEvent)
export class ReservationCancellHandler
  implements IEventHandler<ReservationCancelledEvent>
{
  constructor(
    @Inject(RabbitMQEventPublisherImplement)
    private readonly rabbitMQService: IntegrationEventPublisher,
  ) {}

  async handle(event: ReservationCancelledEvent) {
    await this.rabbitMQService.publish({
      subject: IntegrationEventSubject.RESERVATION_CANCELLED,
      data: {
        ...event,
        eventType: IntegrationEventSubject.RESERVATION_CANCELLED,
      },
    });
  }
}
