import { NextFunction, Request, Response, Router } from "express";
import { Redis, JWT_CONFIG } from "../config";
import { refreshToken } from "../services/OAuthService";


export default () => {

    const router = Router();

    router.post('/revoke', async (req: Request, res: Response, next: NextFunction) => {

        const {refresh_token,access_token }= req.body.access_token;

        if (!access_token || !refresh_token) {
            return res.status(400).send('access_token and refresh_token is required in request body');
        }

        Redis.setex(access_token, JWT_CONFIG.token_expiration, access_token);
        Redis.del(refresh_token);

        return res.send('Token Revoked')

    });


    router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {

        const { refresh_token, email } = req.body;


        if (!refresh_token || !email) {
            return res.status(400).send('refresh_token & email are required')
        }

        try {
            const token = await refreshToken(req.body);
            return res.send(token)
        }
        catch (e) {
            res.status(400).send(e);
        }

    });


    return router;
}
