import { Controller, Get, Request, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guard/google.guard";
import { clearAllCookies } from "./helpers/helpers";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService,) { }

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    signinWithGoogle() { }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    async handleGoogleCallback(@Request() req, @Res() res: Response) {
        return this.authService.handleAuthCallback(req, res, 'google');
    }

    @Get("github/login")
    @UseGuards(AuthGuard('github'))
    signinWithGithub() { }

    @Get("github/callback")
    @UseGuards(AuthGuard('github'))
    handleGithubCallback(@Request() req, @Res() res: Response) {
        return this.authService.handleAuthCallback(req, res, 'github');
    }

    @Get('logout')
    logout(@Res() res: Response) {
        clearAllCookies(res);

        return res.send({ message: "Logout success" })
    }

    @Get('profile')
    async handleGetProfile(@Request() req, @Res() res: Response) {
        const user = await this.authService.getProfile(req, res)

        if (!user) {
            throw new UnauthorizedException("No user found")
        }

        return res.send({ status: "success", message: "Fetched user profile successfully", data: user })
    }
}