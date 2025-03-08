import jwt from 'jsonwebtoken';
import { User } from '../db/model/user.model.js';
export const isAuthenticate=async(req,res,next)=>{
  //get data from request
  try {
    const {authorization}=req.headers;
  if(!authorization)
    return res.status(400).json({
    success:false,
    message:"token is required"
  })
  if(!authorization.startsWith('hambozo'))
    return res.status(400).json({success:false,message:"invalid bearer token"})
  const token=authorization.split(" ")[1];
  const {email,id}= jwt.verify(token,process.env.SECRET_JWT);//return payload || throw error
  //check user existence
  const userExist=await User.findById(id);//{} || null
// if()
  // return res.json(400).json({success:false,message:"this account is deleted"})
  if(!userExist)return res.status(404).json({
     success:false,
     message:"user not found"
    },{new:true})

req.authuser=userExist;
     return next();

  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }
}
//call back function  takes req,res,next next on next function
