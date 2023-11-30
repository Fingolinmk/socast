import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://192.168.178.27:3000/',
      'http://192.168.178.27:3001/',
      'http://podcast.themorikim.de',
    ],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}

bootstrap();
