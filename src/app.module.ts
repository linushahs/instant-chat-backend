import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { MessagesModule } from './messages/messages.module';
import { ConvesationsModule } from './conversations/conversations.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

require('dotenv').config();

@Module({
  imports: [JwtModule, AuthModule, UserModule, PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule.register({ session: true }),
    MessagesModule, ConvesationsModule, EventEmitterModule.forRoot({
      newListener: true,
      removeListener: true,
      wildcard: true,
    })],
})
export class AppModule { }
