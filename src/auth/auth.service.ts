import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GoogleSigninResponse } from "./types/auth.types";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async validateUser(data: GoogleSigninResponse) {
        //check if user already exists in database
        const user = await this.prisma.user.findUnique({
            where: {
                email: data._json.email
            }
        })

        if (user) return user;

        const newUser = await this.prisma.user.create({
            data: {
                email: data._json.email,
                fullname: data._json.name,
                picture: data._json.picture,
            }
        })

        return newUser;
    }

    async findUser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        return user;
    }
}