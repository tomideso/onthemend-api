import container from "../container/inversify.config";
import { Repository, getCustomRepository } from "typeorm";
import TYPES from "../config/types";
import AccountRepository from "./AccountRepository";
import AccountDto from '../Dto/AccountDto'

export default class RepositoryRegister {

    public static register() {
        container.bind<Repository<AccountDto>>(TYPES.AccountRepo).toConstantValue(getCustomRepository(AccountRepository));

    }
}
