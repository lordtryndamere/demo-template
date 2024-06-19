import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from '../integration-event-publisher';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpCommunication implements IntegrationEventPublisher {
  constructor(
    private httpService: HttpService,
    private logger: Logger,
  ) {}

  async publish(message: IntegrationEvent) {
    this.logger.log('publishing http message', message);
    const axiosConfig: any = {
      headers: {
        Accept: 'application/json',
        ...message.data.headers
      },
    };
    const axiosResponse = this.httpService.get(message.data.url, axiosConfig);

    const response = await lastValueFrom(axiosResponse);

    return response.data;
  }
}
