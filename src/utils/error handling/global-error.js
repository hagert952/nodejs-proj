
import express from 'express';
import fs  from "fs";
import path from "path"
export const globalerror=(error,req,res,next)=>{
if(req.file?.path){
    const fullPath=path.resolve(req.file.path)
    fs.unlinkSync(fullPath)
}
    return res.status(error.cause || 500 )
    .json({
    success:false,
    message:error.message
    ,stack:error.stack
    })
    ;
 }

 