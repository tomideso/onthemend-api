import * as bcrypt from "bcryptjs";


export const getHash = (input:string)=>{
    return bcrypt.hashSync(input, 8);
 }