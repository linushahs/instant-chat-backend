import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GoogleAuthGuard } from "./guard/google.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
    constructor() { }

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    signinWithGoogle() { }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    handleGoogleCallback(@Req() req: Request) {
        // console.log(req.user);
        return req.user;
    }

    @Get("github/login")
    @UseGuards(AuthGuard('github'))
    signinWithGithub() { }

    @Get("github/callback")
    @UseGuards(AuthGuard('github'))
    handleGithubCallback(@Req() req: Request) {
        return req.user;
    }
}