import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async createAccount({ provider, email, providerAccountId }) {
        const account = await this.prisma.account.findUnique({
            where: {
                providerAccountId
            }
        })

        if (account) return account;

        await this.prisma.account.create({
            data: {
                email,
                provider,
                providerAccountId,
            }
        })

    }

    async validateUser({ email, fullname, picture }) {
        //check if user already exists in database
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (user) return user;

        const newUser = await this.prisma.user.create({
            data: {
                email,
                fullname,
                picture,
            }
        })

        return newUser;
    }


    async findUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        return user;
    }

    async fetchUserEmail(accessToken: string): Promise<string | null> {
        try {
            const response = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const [{ email }] = response.data;

            console.log("=====================")
            console.log("Email: " + email);
            console.log("=====================")

            return email;
        } catch (error) {
            console.error('Error fetching user email:', error);
            return null;
        }
    }
}