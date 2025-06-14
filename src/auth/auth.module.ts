import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubAuthStrategy, GoogleAuthStrategy } from "./strategy/auth.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleAuthStrategy, GithubAuthStrategy, JwtStrategy],
    exports: [JwtService]
})
export class AuthModule { }