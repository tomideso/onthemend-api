import Account from "../entity/Account";
import { EntityRepository, Repository, EntityManager, getCustomRepository } from "typeorm";
import AccountDto from "../Dto/AccountDto";
import TYPES from "../config/types";
import container from "../container/inversify.config";


@EntityRepository(Account)
export default class AccountRepository extends Repository<AccountDto> {

    private transactionMananger: EntityManager;

    async connect():Promise<EntityManager> {
        if (this.transactionMananger &&
            !this.transactionMananger.queryRunner.isReleased) {
            return Promise.resolve(this.transactionMananger)
        };

        return new Promise((resolve, reject) => {
            this.manager.transaction(async transactionalManager => {
                this.transactionMananger = transactionalManager;
                if (transactionalManager) return resolve(transactionalManager)
                reject();
            })
        })
    }


    public async findByEmail(email: string): Promise<Account> {
        await this.connect();
      
        return this.transactionMananger.findOneOrFail(Account, {
            where: { email },
            select: ["email", "roles", "id"]
        });
    }

}
