import { User } from "@prisma/client";

export interface SigninReponse {
    access_token: string;
    refresh_token?: string
}

export interface SignupRespone {
    id: number;
    fullname: string;
    email: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GoogleSigninResponse {
    _json: {
        sub: string
        name: string
        given_name: string
        family_name: string
        picture: string
        email: string
        email_verified: boolean
        locale: string
    }
}

export interface ReqUser {
    accessToken: string;
    refreshToken: string;
    data: User
}