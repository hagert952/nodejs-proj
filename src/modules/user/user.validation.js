import joi from "joi"
import { generalField } from "../../middelwares/validation.middleware.js";


export const updatePassword=joi.object({
password:joi.required()
}).required()
export const getSpecificUser=
joi.object({id:generalField.id.required()

}).required();
