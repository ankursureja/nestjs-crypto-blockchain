import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://crypto-frontend-service:3000',
  });

  await app.listen(3000);
}

// Initialize the application.
bootstrap();
