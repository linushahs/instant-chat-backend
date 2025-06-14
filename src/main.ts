import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS settings
  app.enableCors({
    origin: ["http://192.168.1.9:5173", "http://localhost:5173"],
    credentials: true,
  });

  // Configure WebSocket adapter
  app.useWebSocketAdapter(
    new IoAdapter(app),
  );

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  app.use(
    cookieParser(),
    session({
      secret: "super-secret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
      }
    }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000, "0.0.0.0");
}

bootstrap();
