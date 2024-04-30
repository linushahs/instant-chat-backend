import { Injectable, Request, Res, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { ReqUser } from "./types/auth.types";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private configService: ConfigService) { }

    async handleAuthCallback(@Request() req: { user: ReqUser }, res: Response, provider: string) {
        if (!req.user) {
            return res.redirect(this.configService.get<string>('CLIENT_LOGIN_URL'));
        }

        res.cookie('userId', req.user.data.id);
        res.cookie('provider', provider);
        res.cookie('access_token', req.user.accessToken, { httpOnly: true });
        res.cookie('refresh_token', req.user.refreshToken, {
            httpOnly: true,
        });

        return res.redirect(this.configService.get('CLIENT_LOGIN_SUCCESS_URL'));
    }

    async getNewAccessToken(refreshToken: string): Promise<string> {
        try {
            const response = await axios.post(
                'https://accounts.google.com/o/oauth2/token',
                {
                    client_id: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
                    client_secret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                },
            );

            return response.data.access_token;
        } catch (error) {
            throw new Error('Failed to refresh the access token.');
        }
    }

    async getProfile(@Request() req, @Res() res: Response) {
        const accessToken = req.cookies['access_token'];
        const refreshToken = req.cookies['refresh_token'];

        if (!accessToken) {
            throw new UnauthorizedException("Not authorized")
        }

        if (this.isTokenExpired(accessToken)) {
            const newAccessToken = await this.getNewAccessToken(refreshToken);

            res.cookie('access_token', newAccessToken, { httpOnly: true });
        }

        return await this.prisma.user.findUnique({
            where: {
                id: req.cookies['userId']
            }
        })
    }


    async isTokenExpired(token: string): Promise<boolean> {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
            );

            const expiresIn = response.data.expires_in;

            if (!expiresIn || expiresIn <= 0) {
                return true;
            }
        } catch (error) {
            return true;
        }
    }

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

    async createUser({ email, fullname, picture }) {
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