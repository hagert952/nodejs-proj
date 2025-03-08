


import CryptoJS from "crypto-js";
export const Encrypt=async ({phone,SECRET_KEY})=>{
    return CryptoJS.AES.encrypt(phone,SECRET_KEY).toString();
}