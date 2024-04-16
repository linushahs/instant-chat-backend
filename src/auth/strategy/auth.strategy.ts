import { PassportStrategy } from "@nestjs/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy, Profile } from "passport-github";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(GithubStrategy, 'github') {
    constructor() {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL,
            scope: ['public_profile'],
        });
    }

    async validate(accessToken: string, _refreshToken: string, profile: Profile) {
        console.log(accessToken, _refreshToken, profile);
        return profile;
    }
}

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(GoogleStrategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
            scope: ["email", "profile"]
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const user = await this.authService.validateUser(profile);

        console.log(accessToken, profile);
        return { accessToken, refreshToken, data: user }
    }
}