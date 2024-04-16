import { Controller, Get, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "./guard/google.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
    constructor() { }

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    signinWithGoogle() {
        return "Success"
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    handleGoogleCallback() {
        console.log("returned to google callback");
        return "asd";
    }

    @Get("github/login")
    @UseGuards(AuthGuard('github'))
    signinWithGithub() {
        return "Success"
    }

    @Get("github/callback")
    @UseGuards(AuthGuard('github'))
    handleGithubCallback() {
        console.log("returned to github callback");
        return "asd";
    }
}