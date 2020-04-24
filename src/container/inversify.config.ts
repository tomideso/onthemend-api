import {Container} from 'inversify';
import TYPES from '../config/types';
import {Redis} from 'ioredis'
import {Redis as RedisClient} from '../config/redis'
import { Passport,PassportImpl } from '../utility/passport';
import { OTPServiceImpl,OTPService } from '../services/OTPService';
import { Repository, getCustomRepository } from 'typeorm';
import AccountRepository from '../Repository/AccountRepository';
import AccountDto from '../Dto/AccountDto';
// import {AddressService, AddressServiceImpl} from './service/AddressService';
// import {AddressController} from './controller/AddressController';
// import {RegistrableController} from './controller/RegisterableController';

const container = new Container();
// container.bind<RegistrableController>(TYPES.Controller).to(AddressController);
container.bind<Redis>(TYPES.Redis).toConstantValue(RedisClient());
container.bind<Passport>(TYPES.Passport).to(PassportImpl);
container.bind<OTPService>(TYPES.OTPService).to(OTPServiceImpl);
// container.bind<Repository<AccountDto>>(TYPES.AccountRepo).toConstantValue(getCustomRepository(AccountRepository));


export default container;