import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

<<<<<<< HEAD

  await app.listen(4000);
=======
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000
  await app.listen(port);
>>>>>>> v2
}
bootstrap();
