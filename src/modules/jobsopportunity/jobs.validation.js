import joi from "joi";
export const addJob=joi.object({
    companyId:joi.string().required(),
    jobTitle: joi.string().required(),

  workingTime: joi.string().required(),

  jobDescription:joi.string().required(),


}).required()


