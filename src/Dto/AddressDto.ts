import userProfileDto from './UserProfileDto'

export default interface AccountDto {

    id?:string;
    address1:string;
    address2?:string;
    zipcode?:string;
    city?:string;
    state?:string;
    phone1?:string;
    phone2?:string;
    userProfile: userProfileDto | string
}
