import { Response } from "express";

export const clearAllCookies = (res: Response) => {
    res.clearCookie('access_token', { httpOnly: true });
    res.clearCookie('refresh_token', { httpOnly: true });
    res.clearCookie('userId', { httpOnly: true });
    res.clearCookie('provider', { httpOnly: true });
}