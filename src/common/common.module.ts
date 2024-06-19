
import { Module, Global } from '@nestjs/common';
import { RedisModule as NestJsRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

//TODO: use localredis instead of elasticache

@Global()
@Module({
    imports: [
      ConfigModule,
      NestJsRedisModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
              return {
                    type:'single',
                    url: configService.get('REDIS_HOST'),
              };
          },
          inject: [ConfigService],
      } ),
    ],
    exports: [NestJsRedisModule],
  })
export class CommonModule {}
