import {MigrationInterface, QueryRunner} from "typeorm";
import  Account, { UserRole }  from "../entity/Account";
import User from "../entity/UserProfile";


export class CreateAdminUser1579788231518 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        let acct = {
            email: process.env.TEST_ADMIN_USERNAME,
            password: process.env.TEST_ADMIN_PASS,
            roles: [UserRole.SUPERADMIN]
        }
        const account = new Account();
        Object.assign(account, acct);
        account.hashPassword();
        console.log(account)

        const new_account = await Account.getRepository().save(account);

        await User.create({
            firstName: "Tomide",
            lastName: "seun",
            age: 27,
            account
        })
        .save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
