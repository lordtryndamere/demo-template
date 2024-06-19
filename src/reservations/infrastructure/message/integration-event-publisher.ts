export class IntegrationEvent {
    readonly subject: string;
    readonly data: Record<string, any>;
  }
  export interface IntegrationEventPublisher {
    publish: (event: IntegrationEvent) => Promise<any>;
  }
  