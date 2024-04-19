import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS settings
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  // Configure WebSocket adapter
  app.useWebSocketAdapter(
    new IoAdapter(app),
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  app.use(
    session({
      secret: "super-secret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24
      }
    }),)
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}

bootstrap();
