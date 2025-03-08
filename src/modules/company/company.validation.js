import joi from "joi";
import { generalField } from "../../middelwares/validation.middleware.js";

export const addCompany=joi.object({
    companyName:joi.string().required()
   , companyEmail:joi.string().required(),
   description:joi.string(),
   industry:joi.string(),
   address:joi.string(),
   
}).required()
export const updateCompany=joi.object({
    companyName:joi.string().required()
   , companyEmail:joi.string().required(),
   description:joi.string(),
   industry:joi.string(),
   address:joi.string(),

}).required()
export const getSpecificCompany=
joi.object({id:generalField.id.required()

}).required();
export const softDelete=
joi.object({id:generalField.id.required()

}).required();
