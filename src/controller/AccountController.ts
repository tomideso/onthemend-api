import { NextFunction, Request, Response, Router } from "express";
import Account from "../entity/Account";
import { Login, ResetPassword } from '../services/AuthService'
import { validate } from 'class-validator'
import { OTPServiceImpl } from "../services/OTPService";



export default () => {

    const OTPService = new OTPServiceImpl();

    let router = Router();

    router.post('/register', async (req: Request, res: Response, next: NextFunction) => {

        req.body.role  = req.body.role || 'patient';
        req.body.role  = String(req.body.role ).toLowerCase();

        if (req.body.role  == 'superadmin') {
            req.body.role  = 'patient'
        }

        const {role,email,password} =req.body;
        const acct =new Account();
        acct.email=email;
        acct.password=password;
        acct.roles = [role];

        const errors = await validate(acct);

        if (errors.length > 0) {
            return res.status(409).send(errors);
        }

        const account = Account.create((<any>acct)).hashPassword();

        try {
            const createdAcct = await account.save();
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

    router.get('/test',async (req,res)=>{

       const user = await OTPService.verify("admin3@gmail.com")

       res.send(user)
    })

    return router;
}