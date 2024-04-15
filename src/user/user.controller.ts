import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@UseGuards(AuthGuard('jwt'))
@Controller("users")
export class UserController {
    constructor() { }

    @Get("me")
    getUserDetails(@Req() req: Request) {
        return req.user;
    }
}