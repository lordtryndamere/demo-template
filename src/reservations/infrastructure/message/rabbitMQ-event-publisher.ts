import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from './integration-event-publisher';
import { RESERVATIONS_MICROSERVICE } from 'src/reservations/domain/constants/inject-constants';

@Injectable()
export class RabbitMQEventPublisherImplement implements IntegrationEventPublisher {
  constructor(@Inject(RESERVATIONS_MICROSERVICE) private readonly client: ClientProxy) {
    this.connect();
  }

  async publish(message: IntegrationEvent): Promise<void> {
    Logger.debug('emiting event ', message.subject);
    this.client.emit(message.subject, message.data);
  }

  private connect(): any {
    this.client.connect();
  }
}
