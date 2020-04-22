import {Entity, Column,OneToOne,JoinColumn} from "typeorm";
import { BaseModel } from "./BaseModel";
import { IsNotEmpty,IsIn } from "class-validator";
import AddressDto from "../Dto/AddressDto";
import UserProfile from "./UserProfile";
// import { Photo } from "./Photo";
 


@Entity()
export default class Address extends BaseModel implements AddressDto {

    @Column()
    address1:string;

    @Column()
    address2:string;

    @Column()
    zipcode:string;

    @Column()
    city:string;

    @Column()
    state:string;

    @Column()
    phone1:string;

    @Column()
    phone2:string;

    @OneToOne(type => UserProfile)
    @JoinColumn()
    userProfile: UserProfile


}