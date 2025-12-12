import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 Importación necesaria
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'),
    { 
      prefix: '/public/'
    }
  ); // 👈 Habilita acceso público a /public
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
