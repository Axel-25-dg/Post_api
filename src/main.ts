import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ CORS (ajusta origins)
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite
      'http://localhost:3000', // si tu front usa este
      'https://higuera-posts-ui.desarrollo-software.xyz',

    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // si usas cookies/sesión
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();