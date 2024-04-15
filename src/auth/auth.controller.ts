import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guard/google.guard";

@Controller("auth")
export class AuthController {
    constructor() { }

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    signinWithGoogle() {
        return "Success"
    }

    @Get("/google/callback")
    @UseGuards(GoogleAuthGuard)
    handleGoogleCallback() {
        console.log("returned to google callback");
        return "asd";
    }

}