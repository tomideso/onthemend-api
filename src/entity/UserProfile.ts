import {Entity, Column,OneToOne,JoinColumn,OneToMany} from "typeorm";
import { BaseModel } from "./BaseModel";
import { IsNotEmpty,IsIn } from "class-validator";
import  Account from "./Account";
import UserProfileDto from "../Dto/UserProfileDto";
// import { Photo } from "./Photo";
 
const Gender =['M','F','-']


@Entity()
export default class UserProfile extends BaseModel implements UserProfileDto {

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsNotEmpty()
    lastName: string;

    @Column()
    middleName: string;

    @Column()
    @IsIn(Gender)
    gender: string;

    @Column()
    occupation: string;

    @Column()
    medicare: string;

    @Column()
    dva: string;

    @Column("text")
    photo_url: string;

    @Column("text")
    signature: string;

    @Column("text")
    about: string;

    @Column()
    height: string;

    @Column()
    weight: string;

    @Column()
    timezone: string;

    @Column()
    age: Date;

    @OneToOne(type => Account,account=>account.userProfile,{nullable:false})
    @IsNotEmpty()
    @JoinColumn({name:'account_id'})
    account:Account;

    // @OneToMany(type => Photo, photo => photo.user)
    // photos: Photo[];

}