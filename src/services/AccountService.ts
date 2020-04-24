import Account from '../entity/Account'
import { Request, Response } from "express";
import { generateAccessToken } from '../middleware/auth';
import { validate } from 'class-validator';



export const Login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password } = req.body;

    if (!(email && password)) {
        return res.status(401).send("Wrong username or password");
    }

    //Get user from database
    let account: Account;
    try {
        account = await Account.findOneOrFail({
            where: { email },
            select: ["password", "email", "roles", "id"]
        });

    } catch (error) {
        return res.status(401).send("Wrong username or password");
    }

    //Check if encrypted password match
    if (!account.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).send("Wrong password");
        return;
    }

    (<any>req).user = {
        id: account.id,
        email: account.email,
        roles: account.roles
    };
    return generateAccessToken(req, res)

};


export const ResetPassword = async ({ email, old_password, new_password }):Promise<string> => {

    //Get user from database
    let account: Account;
    try {
        account = await Account.findOneOrFail({
            where: { email },
            select: ["password", "email", "roles", "id"]
        });

    } catch (error) {
        throw "Unable to authenticate user";
    }

    //Check if encrypted password match
    if (!account.checkIfUnencryptedPasswordIsValid(old_password)) {
        throw "Wrong password.";
    }

    //Validate de model (password lenght)
    account.password = new_password;
    const errors = await validate(account);

    if (errors.length > 0) {
        throw errors;
    }
    //Hash the new password and save
    account.hashPassword();

    try {
        const acct = await account.save()
        return "Password Successfully Changed";

    }
    catch (e) {
        throw "Error updating password.";
    }

};