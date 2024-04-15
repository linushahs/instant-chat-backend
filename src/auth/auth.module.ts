import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionSerializer } from "./serializers/session-serializer";
import { GoogleAuthStrategy } from "./strategy/google.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleAuthStrategy, SessionSerializer],
})
export class AuthModule { }