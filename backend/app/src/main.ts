import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  // });
  const fontend_url = configService.get<string>('CORS_URL', 'http://localhost:3000');
  app.enableCors({
    origin: [fontend_url],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(configService.get<number>('SERVER_PORT', 4000));
}

bootstrap();
