import joi from 'joi';
import { Types } from 'mongoose';
export const isValidId=(value,helpers)=>{
    if(!Types.ObjectId.isValid(value)){
return helpers.message("invalid id")
}
return true;
   }
// import isValidId from './'
export const generalField={
    id:joi.custom(isValidId),
   attachment: joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        mimetype:joi.string().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        path:joi.string().required()
        ,size:joi .number().required()
    })
}
export const isValid=(schema)=>{
    return (req,res,next)=>{
// const schema =joi .object({
//     userName:joi.string().min(2).max(20).required(),
//     email:joi.string().email().required(),
//     password:joi. string().required(),
//     cPassword:joi.string().valid(joi.ref ("password")).required(),
//     phone :joi.string().valid (...Object.values(genders))
// }).required();
const data={...req.body,...req.params,...req.query}
console.log(data);
if(req.file||req.files)data.attachment=req.file||req.files;

const result =schema.validate(data,{abortEarly:false})    
if(result.error){
    let messages=result.error.details.map((obj)=> obj.message);
    
    return next(new Error(messages,{cause:400}));
}
return next();
};
    
};