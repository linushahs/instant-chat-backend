import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as GithubStrategy, Profile } from "passport-github";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(
  GithubStrategy,
  "github",
) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL,
      scope: ["public_profile", "user:email"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const userEmail = await this.authService.fetchUserEmail(accessToken);
    const user = await this.authService.createUser({
      email: userEmail,
      fullname: profile.displayName,
      picture: profile.photos[0].value,
    });

    await this.authService.createAccount({
      email: userEmail,
      provider: profile.provider,
      providerAccountId: String((profile._json as any).id),
    });

    return { accessToken, refreshToken, data: user };
  }
}

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  GoogleStrategy,
  "google",
) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "consent",
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
  ) {
    const user = await this.authService.createUser({
      email: profile._json.email,
      fullname: profile._json.name,
      picture: profile._json.picture,
    });

    await this.authService.createAccount({
      email: profile._json.email,
      provider: profile.provider,
      providerAccountId: profile.id,
    });

    return { accessToken, refreshToken, data: user };
  }
}
