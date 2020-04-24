import OpeningHoursDto from "../Dto/OpeningHoursDto";
import { BaseModel } from "./BaseModel";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IsBoolean, IsNotEmpty, IsIn } from "class-validator";
import Hospital from "./Hospital";

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',"Public Holiday"];


@Entity()
export default class OpeningHours extends BaseModel implements OpeningHoursDto{
   

    @Column()
    @IsNotEmpty()
    openingTime:string;

    @Column()
    @IsNotEmpty()
    closingTime:string;

    @Column({default:true})
    @IsBoolean()
    allDay:boolean;

    @Column()
    @IsIn(days)
    day:string;

    @Column({default:true})
    open:boolean;

    @JoinColumn()
    @ManyToOne(type=>Hospital,hopistal=>hopistal.openingHours)
    hospital:Hospital;

}


export const DefaultOpeningHours = days.map((day)=>{

    const obj:OpeningHoursDto={
        openingTime:'07:00am',
        closingTime:'07:00pm',
        allDay:true,
        day:day,
        open:true,
    };

    return obj;
});