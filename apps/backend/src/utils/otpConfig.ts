import * as dotenv from "dotenv";
dotenv.config();



export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}




