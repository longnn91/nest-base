import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseModule } from './base';
import { CommonModule, LoggerMiddleware } from './common';
import { configuration } from './config';
import { UserModule } from './modules/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const username = configService.get('mongodb.user');
        const password = configService.get('mongodb.password');
        const host = configService.get('mongodb.host');
        const port = configService.get('mongodb.port');
        const database = configService.get('mongodb.database');

        return {
          uri: `mongodb://${username}:${password}@${host}:${port}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    CommonModule,
    BaseModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
