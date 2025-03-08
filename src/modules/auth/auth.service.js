import { otptype } from "../../db/model/enums/user.enums.js";
import { User } from "../../db/model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
// import * as enums from '../../db/model/enums/user.enums.js';
import {sendEmail} from '../../utils/email/send-email.js';
import { hash } from "../../utils/hashing/hash.js";
import { OAuth2Client } from "google-auth-library";
export const signUp=async(req,res,next)=>{
    const {email,userName,password,mobileNumber}=req.body;
    const userExist=await User.findOne({email});
    if(userExist) return next(new Error ("email already exist",{cause:400}));
    const otp=Math.floor(100000+Math.random()*900000).toString();
    const otpHash=await bcrypt.hash(otp, 10);
     const create=await User.create({
       email,userName,password,mobileNumber,
       OTP:[{
        code:otpHash,type:otptype.CONFIRMEMAIL,expiresIn:new Date(Date.now()+10*60*1000)
       }] 
     })

     await sendEmail({to:email,subject:"verify account",html:`your otp :${otp}`})
   res.status(201).json({success:true,message:'created successfully'})

    }

    export const confirmOtp=async(req,res,next)=>{
     const {email,otpCode}=req.body;
      const emailExist=await User.findOne({email});
if(!emailExist)return next(new Error("email not exist",{cause:400}))
  const otpvalid=await emailExist.OTP.find(otp=>otp.type=="confirmEmail")
if(!otpvalid)return next(new Error("invalid otp"));
if(new Date()>otpvalid.expiresIn){
  return next(new Error ("otp expired"));
}
const match=await bcrypt.compare(otpCode,otpvalid.code);
if(!match) return next(new Error("invalid otp",{cause:400}))
  emailExist.isConfirmed=true;
emailExist.OTP=[];
await emailExist.save();
return res.status(200).json({message:"created Successfully"})
}
// export const signIn = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email,provider:"system" });
//   if(!user)
//     return next(new Error("invalid email and password",{cause:400}))
//   if(!user.isConfirmed)
//     return next(new Error("please confirm your email first",{cause:400}))
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//   if (user.isTwoStepEnabled) {
//     const otp = crypto.randomInt(100000, 999999).toString();
//     user.twostepcode = otp;
//     user.twostepsexpired = new Date(Date.now() + 10 * 60 * 1000);

//     await user.save();
//     await sendEmail(user.email, 'Login Verification Code', `Your OTP: ${otp}`);

//     return res.json({ message: 'OTP sent. Confirm login with OTP.' });
//   }

//   const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, { expiresIn: '1h' });
//   const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT, { expiresIn: '7d' });
//   res.json({ token, user });

// };
export const signIn = async (req, res,next) => {
  const { email, password } = req.body;
  // const user = await User.findOne({ email });
  const user = await User.findOne({ email,provider:"system" });
  if(!user)
    return next(new Error("invalid email and password",{cause:400}))
  if(!user.isConfirmed)
    return next(new Error("please confirm your email first",{cause:400}))
  // const isMatch = await bcrypt.compare(password, user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new Error("Invalid Credential",{cause:400}))

  if (user.isTwoStepEnabled) {
    const otp = crypto.randomInt(100000, 999999).toString();
    user.twostepcode = otp;
    user.twostepsexpired = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();
    await sendEmail(user.email, 'Login Verification Code', `Your OTP: ${otp}`);

    return res.status(201).json({ message: 'OTP sent. Confirm login with OTP.' });
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT, { expiresIn: '1d' });
  res.status(201).json({ token, refreshToken,user });

};
const verifyGoogleToken=async(idToken)=>{
const client=new OAuth2Client();
const ticket=await client.verifyIdToken({
  idToken,
  audience:process.env.CLIENT_ID
});
const payload=ticket.getPayload();
console.log(payload);
return payload

}
export const googleLogin=async(req,res,next)=>{
const {idToken}=req.body;

const {email,name,picture}= await verifyGoogleToken(idToken);
//check email existence
const userExist=await User.findOne({email});
if(!userExist)
 await User.create({userName:name,email,provider:'google',profile:{secure_url:picture,public_id:null}})
const accessToken=jwt.sign(
  {userId:userExist._id,},process.env.SECRET_JWT,
  {expiresIn:"1h"}
)
const refreshToken=jwt.sign({userId:userExist._id},
process.env.SECRET_JWT,
{expiresIn:"7d"}

);

res.status(200).json({
  success:true,
  message:"Logged in successfully",
  accessToken,refreshToken
})
}

export const forgetPassword=async (req,res,next)=>{
  const {email}=req.body
  const user =await User.findOne({email})
  if(!user){
      return next(new Error('email notexists',{cause:404}))
  }
  const otp=Math.floor(1000000+Math.random()*900000).toString();
  console.log({otp});
  const hashing =await 
  hash({key:otp,SALT_ROUNDS:8
  })

  await User.updateOne({email},{OTP:[{
  
    code:hashing,type:'forgetPassword'
    ,expiresIn:
    new Date(Date.now()+10*60*1000)
  }]},
     
      // {
      //     otpPassword: hashing,
      //     failedAttempts: 0,
      //     banUntil: null,
      //   }

  ) 
await sendEmail(
 {to: email,subject:"forgetpassword",
  html:`<p>Your OTP for password reset is: <strong>${otp}</strong></p>`}

      )
     return res.status(201).json({
      success:true,message :"check your mail"
     })
  
}
export const resetPassword=async (req, res, next) => {
  try {
      const { email, otp, rePassword } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
          return next(new Error("User not found", { cause: 400 }));
      }
      const otpData = user.OTP.find(entry => entry.type === "forgetPassword");

      if (!otpData) {
          return next(new Error("Invalid OTP", { cause: 400 }));
      }
      if (new Date(otpData.expiresIn) < new Date()) {
          return next(new Error("OTP expired", { cause: 400 }));
      }
      const isMatch = await bcrypt.compare(otp, otpData.code);
      if (!isMatch) {
          return next(new Error("Invalid OTP", { cause: 400 }));
      }

      // Hash the new password
      // const hashedPassword = await bcrypt.hash(rePassword, 10);
      user.password = rePassword;

      // Remove OTP after successful reset
      user.OTP = user.OTP.filter(entry => entry.type !== "forgetPassword");

      await user.save();

      return res.status(201).json({
          success: true,
          message: "Password reset successfully"
      });

  } catch (error) {
      return next(new Error("Something went wrong", { cause: 500 }));
  } 
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;


    const result = jwt.verify(refreshToken, process.env.SECRET_JWT);

    const user = await User.findById(req.authuser._id);
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    const refreshTokenIssuedAt = new Date(result.iat * 1000).getTime(); 
    const credentialsUpdatedAt = user.changeCredentialTime ? new Date(user.changeCredentialTime).getTime() : 0;

    if (refreshTokenIssuedAt < credentialsUpdatedAt) {
      return next (new Error("please login first",{cause:400}))
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET_JWT,
      { expiresIn: "1h" } 
    );

    return res.status(200).json({
      success: true,
      message: "created successfully",
      accessToken,
    });
 
};