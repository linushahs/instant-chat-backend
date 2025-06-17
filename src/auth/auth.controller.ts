import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guard/google.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@Request() req, @Res() res: Response) {
    return this.authService.getProfile(req, res);
  }

  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  signinWithGoogle() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async handleGoogleCallback(@Request() req, @Res() res: Response) {
    return this.authService.handleAuthCallback(req, res);
  }

  @Get("github/login")
  @UseGuards(AuthGuard("github"))
  signinWithGithub() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  handleGithubCallback(@Request() req, @Res() res: Response) {
    return this.authService.handleAuthCallback(req, res);
  }
}
