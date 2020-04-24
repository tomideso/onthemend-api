import HospitalDto from "./HospitalDto";

export default interface OpeningHoursDto {

    id?:string;
    day:string
    open:boolean;
    openingTime?:string;
    closingTime?:string;
    allDay?:boolean;
    hospital?:HospitalDto | string
}
