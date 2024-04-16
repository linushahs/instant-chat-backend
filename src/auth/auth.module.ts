import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionSerializer } from "./serializers/session-serializer";
import { GithubAuthStrategy, GoogleAuthStrategy } from "./strategy/auth.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleAuthStrategy, GithubAuthStrategy, SessionSerializer],
})
export class AuthModule { }