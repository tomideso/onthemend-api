import userProfileDto from './UserProfileDto'
import AddressDto from './AddressDto';
import OpeningHoursDto from './OpeningHoursDto';

export default interface HospitalDto {

    id?:string;
    name:string
    webUrl:string;
    about?:string;
    banner?:string;
    logo?:string;
    type?:string;
    address:AddressDto;
    openingHours:OpeningHoursDto[] | string[]
    userProfiles: userProfileDto[] | string[];
}
