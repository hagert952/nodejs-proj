




import bcrypt from 'bcrypt'
export const hash=async({
    key,SALT_ROUNDS=8})=>{
        return bcrypt .
        hashSync(key,Number(SALT_ROUNDS))
    }