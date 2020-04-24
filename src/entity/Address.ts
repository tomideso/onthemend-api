import {Entity, Column,OneToOne,JoinColumn} from "typeorm";
import { BaseModel } from "./BaseModel";
import { IsNotEmpty } from "class-validator";
import AddressDto from "../Dto/AddressDto";
import UserProfile from "./UserProfile";
 


@Entity()
export default class Address extends BaseModel implements AddressDto {

    @Column()
    @IsNotEmpty()
    address1:string;

    @Column()
    address2:string;

    @Column()
    @IsNotEmpty()
    zipcode:string;

    @Column()
    @IsNotEmpty()
    city:string;

    @Column()
    @IsNotEmpty()
    state:string;

    @Column()
    phone1:string;

    @Column()
    phone2:string;

    @OneToOne(type => UserProfile)
    @JoinColumn()
    @IsNotEmpty()
    userProfile: UserProfile


}