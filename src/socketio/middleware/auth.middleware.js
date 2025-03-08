import jwt from 'jsonwebtoken';
import { User } from '../../db/model/user.model.js';
export const authSocket=async(socket,next)=>{
  //get data from request
  try {
    const {authorization}=socket.handshake.auth;
  if(!authorization)
    return next(new Error("token is required!"))
  if(!authorization.startsWith('hambozo'))
    return next(new Error("invalid bearer token!"))
  const token=authorization.split(" ")[1];
  const {email,id}= jwt.verify(token,process.env.SECRET_JWT);//return payload || throw error
  //check user existence
  const userExist=await User.findById(id);//{} || null
  if(!userExist) return next(new Error("user not found!"))

socket.authuser=userExist;
socket.id=userExist.id;
     return next();

  } catch (error) {
return next(error)
}
}
//call back function  takes req,res,next next on next function
