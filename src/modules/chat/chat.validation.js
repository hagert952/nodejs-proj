import joi from "joi";

export const sendMessage=joi.object({
    receiverId:joi.string().required()
}).required()