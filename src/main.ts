import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { swaggerConfig } from './utils/swagger';
import { UserModule } from './user-module/user.module';
import { AuthModule } from './auth-module/auth.module';
import { DocumentModule } from './document-module/document.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {});
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const swaggerService = configService.get<string>('SWAGGER_SERVICE', null);
  swaggerConfig({
    app,
    name: 'user',
    module: UserModule,
    server: {
      service: swaggerService,
    },
  });
  swaggerConfig({
    app,
    name: 'auth',
    module: AuthModule,
    server: {
      service: swaggerService,
    },
  });
  swaggerConfig({
    app,
    name: 'document',
    module: DocumentModule,
    server: {
      service: swaggerService,
    },
  });
  const port = configService.get<string>('PORT', '3000');
  await app.listen(port, () => logger.log(`listening on port ${port}`));
}
bootstrap();
