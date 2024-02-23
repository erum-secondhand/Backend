import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
  Logger.log(`Server running on http://localhost:8080`, 'Bootstrap');
}
bootstrap();
