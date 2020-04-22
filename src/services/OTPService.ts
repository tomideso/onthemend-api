import AccountDto from "../Dto/AccountDto";
import { Redis } from "../config";
import { sendMail } from "./EmailService";
import Account from "../entity/Account";
import AccountRepository from "../Repository/AccountRepository";
import {getCustomRepository} from "typeorm";
const moment = require('moment-timezone');
const crypto = require('crypto');



export class OTPServiceImpl implements OTPService {

    private accountRepo:AccountRepository;

    constructor(){
        this.accountRepo=getCustomRepository(AccountRepository);
    }

    public send(account: Account,host:string): Promise<any> {
        const randomToken = crypto.randomBytes(12).toString('hex');
        const recipient = account.email;

        const subject = "OnTheMend Account Verification";
        const body = `Welcome to OnTheMend. To start your free trial you will need to verify your account by tapping on the following link:  <a href="http://${host}/v1/account/verify/${randomToken}">http://${host}/v1/account/verify/${randomToken}</a>`;

        const key = `${account.id}:emailotp`
        //store token for an hour
        Redis.setex(randomToken, 60*60*60, recipient);
        Redis.setex(key, 60*60*60, randomToken);

        return sendMail({subject,recipient,body});
    }


    public async verify(token: string):Promise<Account> {

        //store token for an hour
        const accountEmail = await Redis.get(token).catch(err=>false);

        if(!accountEmail){
            throw "The verification link is invalid";
        }
        
        return await this.accountRepo.findByEmail(<string>accountEmail);
    }


    public async resend(accountId:string,host:string):Promise<any>{
        const key = `${accountId}:emailotp`
        const token = await Redis.get(key).catch(err=>false);

        if(token){
            Redis.del(token as string);
            Redis.del(key);
        }
        
       try{
            const account =await Account.findOneOrFail(accountId,{
                select: ["email", "id"]
            });

            return this.send(account,host);
       }
       catch(e){
           throw "Can't find account with id "+accountId;
       }
    }
}



export interface OTPService {
    send(account: Account,host:string): Promise<any>;
    verify(token: string,): Promise<Account>;
    resend(accountId:string,host:string): Promise<any>;
}