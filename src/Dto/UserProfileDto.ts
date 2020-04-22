import  AccountDto from "./AccountDto";
 
export default interface UserProfileDto{
    
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    occupation: string;
    medicare: string;
    dva: string;
    photo_url: string;
    signature: string;
    about: string;
    height: string;
    weight: string;
    timezone: string;
    age: Date;
    account:AccountDto | string;

}