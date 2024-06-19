import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReservationsModule } from './reservations/reservations.module';

import { WinstonModule } from 'nest-winston';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import * as winston from 'winston';
import { ReservationOrmEntity } from './reservations/infrastructure/database/entities';


export class SNSConfig {
  readonly topic: string;
  readonly region: string;
}

export class SQSConfig {
  readonly delay: string;
  readonly url: string;
  readonly region: string;
}



@Module({
  imports: [
    ReservationsModule,
    CqrsModule,
    HttpModule,
    WinstonModule.forRoot(AppModule.loggerConfig()),
    ConfigModule.forRoot({isGlobal:true}),
    ClientsModule.register([
      {
        name: 'RESERVATIONS_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://reservations:reservations@localhost:5672/'],
          queue: 'reservations_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [ReservationOrmEntity],
        synchronize: true, // Set to false in production, use migrations instead
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ Logger],
  exports:[Logger]
})
export class AppModule {
  static node_environment(): string {
    const { NODE_ENV } = process.env;
    return NODE_ENV;
  }
  static environment(): string {
    const { ENVIRONMENT } = process.env;
    return (ENVIRONMENT ? ENVIRONMENT : 'LOCAL').toUpperCase();
  }
  static logLevel(): string {
    const { LOG_LEVEL } = process.env;
    return (LOG_LEVEL ? LOG_LEVEL : 'info').toLowerCase();
  }
  static apiPrefix(): string {
    const { API_PREFIX } = process.env;
    return API_PREFIX ? API_PREFIX : '';
  }
  static port(): number {
    const { PORT } = process.env;
    return PORT && Number(PORT) ? Number(PORT) : 5000;
  }
  static app_title(): string {
    const { APP_TITLE } = process.env;
    return APP_TITLE ? APP_TITLE : 'PIN MS';
  }
  static sqsEventsConfig(): SQSConfig {
    return {
      delay: process.env.SQS_DELAY || '10',
      url:
        process.env.SQS_URL ||
        'https://sqs.us-east-1.amazonaws.com/525443015883/educando-ms-queue',
      region: process.env.AWS_REGION || 'us-east-1',
    };
  }
  static snsEventsConfig(): SNSConfig {
    return {
      topic:
        process.env.SNS_TOPIC ||
        'arn:aws:sns:us-east-1:525443015883:pin-handler',
      region: process.env.AWS_REGION || 'us-east-1',
    };
  }

  static loggerConfig(): winston.LoggerOptions {
    const format =
      AppModule.environment() !== 'LOCAL'
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.ms(),
            winston.format.simple(),
          );

    return {
      level: AppModule.logLevel(),
      defaultMeta: {
        applicationName: AppModule.app_title(),
        environment: AppModule.environment(),
        node_env: AppModule.node_environment(),
      },
      transports: [
        new winston.transports.Console({
          format,
        }),
      ],
    };
  }
}
