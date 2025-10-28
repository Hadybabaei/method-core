import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Env } from './utils';
import { UserModule } from './user-module/user.module';
import { AuthModule } from './auth-module/auth.module';
import { RedisModule } from './utils/redis/redis.module';
import { DocumentModule } from './document-module/document.module';

export const mongooseConfigFactory = async (configService: ConfigService) => ({
  uri:
    configService.get<string>('MONGODB_CONNECTION_STRING') ||
    `mongodb://${encodeURIComponent(
      configService.get<string>('MONGODB_USERNAME', 'admin'),
    )}:${encodeURIComponent(
      configService.get<string>('MONGODB_PASSWORD', '1'),
    )}@${configService.get<string>('MONGODB_HOSTNAME', 'localhost')}:${configService.get<number>(
      'MONGODB_PORT',
      27017,
    )}/?replicaSet=${configService.get<string>('MONGODB_REPLICASET', 'rs0')}` +
      `&directConnection=${configService.get<string>('MONGODB_DIRECT', 'false')}` +
      `&readPreference=${configService.get<string>('MONGODB_READ_PREFERENCE', 'primary')}`,
  dbName: configService.get<string>('MONGODB_DATABASE', 'db-user'),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === Env.Development ? '.env.dev' : '.env',
    }),

    /**
     * Mongoose Module
     */
    UserModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({}),
    }),
    AuthModule,
    DocumentModule,
    RedisModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseConfigFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
