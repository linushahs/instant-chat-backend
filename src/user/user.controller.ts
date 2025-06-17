import { Controller, Get, Request, Res } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userSerivce: UserService) {}

  @Get()
  async getListOfUsers(@Request() req, @Res() res: Response) {
    const userId = req.cookies["userId"];
    const users = await this.userSerivce.getListOfUsers(userId);

    return res.send({ message: "Fetched list of users successfully", users });
  }
}
