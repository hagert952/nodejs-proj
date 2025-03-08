import { Application } from "../../db/model/application.js"

export const post=async(req,res,next)=>{
     
const {}=req.body;
const user=req.authuser._id;
await Application.create({userId:user})
res.status(200).json({success:true});

}