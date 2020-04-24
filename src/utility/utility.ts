import * as bcrypt from "bcryptjs";


export const getHash = (input:string)=>{
    return bcrypt.hashSync(input, 8);
 }

 export const getRandomNumber =(length:number)=>(
     Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1))
);
