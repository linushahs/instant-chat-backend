import {
  Injectable,
  Request,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { ReqUser } from "./types/auth.types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: "7d" },
    );

    return refreshToken;
  }

  async getTokenPair(user: ReqUser["data"]) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user.id),
    };
  }

  async handleAuthCallback(@Request() req: { user: ReqUser }, res: Response) {
    const user = req.user;
    const jwt = await this.getTokenPair(user.data);
    const clientUrl = this.configService.get<string>(
      "CLIENT_LOGIN_SUCCESS_URL",
    );

    if (!clientUrl) {
      throw new Error(
        "CLIENT_LOGIN_SUCCESS_URL is not defined in environment variables",
      );
    }

    const redirectUrl = new URL(clientUrl);
    redirectUrl.searchParams.append("access_token", jwt.access_token);
    redirectUrl.searchParams.append("refresh_token", jwt.refresh_token);

    return res.redirect(redirectUrl.toString());
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.findUser(decoded.sub);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return this.jwtService.sign({ email: user.email, sub: user.id });
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getProfile(@Request() req, @Res() res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return res.send({ data: user });
  }

  async createAccount({ provider, email, providerAccountId }) {
    const account = await this.prisma.account.findUnique({
      where: {
        providerAccountId,
      },
    });

    if (account) return account;

    await this.prisma.account.create({
      data: {
        email,
        provider,
        providerAccountId,
      },
    });
  }

  async createUser({ email, fullname, picture }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) return user;

    const newUser = await this.prisma.user.create({
      data: {
        email,
        fullname,
        picture,
      },
    });

    return newUser;
  }

  async findUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async fetchUserEmail(accessToken: string): Promise<string | null> {
    try {
      const response = await axios.get("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const [{ email }] = response.data;
      return email;
    } catch (error) {
      console.error("Error fetching user email:", error);
      return null;
    }
  }
}
