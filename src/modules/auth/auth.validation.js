import joi from "joi";

export const signup=
joi.object({
    userName:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().required(),
    mobileNumber:joi.string().required(),
    
}).required();
export const confirmOtp=joi.object({
    email:joi.string().required()
    ,otpCode:joi.string().required()
})
export const signIn=joi.object({
    email:joi.string().required(),
    password:joi.string().required()
})
export const forgetPassword=joi.object({
    email:joi.string().required()
}).required()
export const resetPassword=joi.object({
    email:joi.string().required()
    ,otp:joi.string().required()
     ,newPassword:joi.string().required()
}).required()
export const refreshToken=joi.object({
    refreshToken:joi.string().required()
 
}).required()
// export const googleLogin=joi.object({
//     email:joi.string().required(),

// }).required()