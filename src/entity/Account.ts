import { Entity,OneToOne,JoinColumn, Column, Unique } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Length, IsEmail,IsNotEmpty,IsBoolean, IsOptional } from "class-validator";
import * as bcrypt from "bcryptjs";
import  UserProfile  from "./UserProfile";
import AccountDto from "../Dto/AccountDto";

export enum UserRole {
    SUPERADMIN = "superadmin",
    PATIENT = "patient",
    DOCTOR = "doctor",
    HOSPITAL="hospital"
}

 
@Entity()
@Unique(["email"])
export default class Account extends BaseModel implements AccountDto {

    @Column()
    @IsEmail()
    email: string;

    @Column({default:false})
    @IsOptional()
    @IsBoolean()
    isEmailVerified:boolean

    @Column({select: false})
    @Length(5, 200)
    @IsNotEmpty()
    password: string;

    @Column({default:false})
    @IsBoolean()
    @IsOptional()
    active: boolean;
    
    @Column({ type: 'simple-array',default:`[${UserRole.PATIENT}]`})
    roles: string[]; 

    // @Column({
    //     type: "set",
    //     enum: UserRole,
    //     default: [UserRole.PATIENT]
    // })
    // roles: UserRole[]

    @OneToOne(type => UserProfile,user=>user.account)
    @JoinColumn()
    userProfile:UserProfile;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
        return this;
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}
