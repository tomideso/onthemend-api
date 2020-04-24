import { sendMail } from "./EmailService";
import Account from "../entity/Account";
import AccountRepository from "../Repository/AccountRepository";
import { injectable, inject } from "inversify";
import TYPES from "../config/types";
import { Redis } from 'ioredis'
import { getRandomNumber } from "../utility/utility";



@injectable()
export class OTPServiceImpl implements OTPService {

    private accountRepo: AccountRepository;

    private redisClient: Redis;


    constructor(@inject(TYPES.Redis) redisClient: Redis,
        @inject(TYPES.AccountRepo) accountRepo
    ) {
        this.redisClient = redisClient;
        this.accountRepo = accountRepo;
    }

    public send(account: Account, host: string): Promise<any> {
        const randomToken = getRandomNumber(4)+"";
        const recipient = account.email;

        const subject = "OTP code for Account Email Verification";
        const body = `You are few steps away from completing your Registration. <p>Please, use the code <strong>${randomToken}</strong> to verify your email<p>`;

        const key = `${account.id}:emailotp`
        //store token for an hour
        this.redisClient.setex(randomToken, 60 * 60 * 60, recipient);
        this.redisClient.setex(key, 60 * 60 * 60, randomToken);

        return sendMail({ subject, recipient, body });
    }


    public async verify(token: string): Promise<Account> {

        //store token for an hour
        const accountEmail = await this.redisClient.get(token).catch(err => false);

        if (!accountEmail) {
            throw "The verification link is invalid";
        }

        // this.redisClient.del(token);
        return await this.accountRepo.findByEmail(<string>accountEmail);
    }


    public async resend(accountId: string, host: string): Promise<any> {
        const key = `${accountId}:emailotp`
        const token = await this.redisClient.get(key).catch(err => false);

        if (token) {
            this.redisClient.del(token as string);
            this.redisClient.del(key);
        }

        try {
            const account = await Account.findOneOrFail(accountId, {
                select: ["email", "id"]
            });

            return this.send(account, host);
        }
        catch (e) {
            throw "Can't find account with id " + accountId;
        }
    }
}



export interface OTPService {
    send(account: Account, host: string): Promise<any>;
    verify(token: string, ): Promise<Account>;
    resend(accountId: string, host: string): Promise<any>;
}