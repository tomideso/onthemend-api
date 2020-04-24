import {Entity, Column,OneToOne,JoinColumn,OneToMany} from "typeorm";
import { BaseModel } from "./BaseModel";
import HospitalDto from "../Dto/HospitalDto";
import UserProfile from "./UserProfile";
import Address from "./Address";
import { IsNotEmpty } from "class-validator";
import OpeningHours,{DefaultOpeningHours} from "./OpeningHours";
 


@Entity()
export default class Hospital extends BaseModel implements HospitalDto {
    
    @Column()
    @IsNotEmpty()
    name:string;

    @Column()
    webUrl:string;

    @Column()
    about:string;

    @Column()
    banner:string;

    @Column()
    logo:string;
  
    @Column()
    type:string;

    @JoinColumn()
    @OneToOne(type => Address)
    address:Address;

    
    @JoinColumn()
    @OneToMany(type => OpeningHours,hours=>hours.hospital,{eager:true})
    openingHours:OpeningHours[];
    
    @OneToMany(type => UserProfile, profile => profile.address)
    @JoinColumn()
    userProfiles:UserProfile[];

}