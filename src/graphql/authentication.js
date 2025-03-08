import jwt from 'jsonwebtoken';
import { User } from '../db/model/user.model.js';
export const isAuthenticate=async(context)=>{
  //get data from request

    const {authorization}=context;
  if(!authorization)
    throw new Error("token is required",{cause:400})
  if(!authorization.startsWith('hambozo'))
    throw new Error("invalid bearer token!",{cause:400})
  const token=authorization.split(" ")[1];
  const {email,id,iat}= jwt.verify(token,process.env.SECRET_JWT);//return payload || throw error
  //check user existence
  const userExist=await User.findById(id);//{} || null
  if(!userExist)
  throw new Error("user not found",{cause:400})
if(userExist.isDeleted==true)
    throw new Error("your account is freezed plz login first",{
cause:400})

if(userExist.deletedAt?.getTime()>iat*1000)
    throw new Error ("destroyed token",{cause:400})
context.authuser=userExist;
    


}
//call back function  takes req,res,next next on next function
