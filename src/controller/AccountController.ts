import { NextFunction, Request, Response, Router } from "express";
import Account from "../entity/Account";
import { Login, ResetPassword } from '../services/AccountService'
import { validate } from 'class-validator'
import { OTPService } from "../services/OTPService";
import container from "../container/inversify.config";
import TYPES from "../config/types";
import { sendMail } from "../services/EmailService";

export default () => {


    const OTPService = container.get<OTPService>(TYPES.OTPService)
    const router = Router();

    router.post('/register', async (req: Request, res: Response, next: NextFunction) => {

        req.body.role = req.body.role || 'patient';
        req.body.role = String(req.body.role).toLowerCase();

        if (req.body.role == 'superadmin') {
            req.body.role = 'patient'
        }

        const { role, email, password } = req.body;
        const acct = new Account();
        acct.email = email;
        acct.password = password;
        acct.roles = [role];

        const errors = await validate(acct);

        if (errors.length > 0) {
            return res.status(409).send(errors);
        }

        const account = Account.create((<any>acct)).hashPassword();

        try {

            const createdAcct = await account.save();
            OTPService.send(account, 'localhost:3000')
            res.status(201).send(createdAcct);

        } catch (e) {
            return res.status(409).send("Email address already in use");
        }

    });


    router.post('/login', Login);

    router.put('/reset_password', async (req: Request, res: Response, next: NextFunction) => {

        const { old_password, new_password } = req.body;
        const { email } = (<any>req).user;

        if (!old_password || !new_password) {
            return res.status(400).send('new_password & old_password are required')
        }

        try {
            const result = await ResetPassword({ email, old_password, new_password });
            return res.status(201).send(result)
        }
        catch (e) {
            res.status(401).send(e);
        }

    });

    router.get('/verify/:token', async (req, res) => {

        try {
            const user = await OTPService.verify(req.params.token);
            res.send(user)
        }
        catch (e) {
            res.status(409).send(e)
        }

    })

    return router;
}