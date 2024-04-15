import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private authService: AuthService) {
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload, done: Function) {
        const user = await this.authService.findUser(payload.data.id);
        console.log('Deserialize User');
        return user ? done(null, user) : done(null, null);
    }
}