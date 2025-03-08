import cryptoJs from "crypto-js";
import { defaultProfilePic, defaultPublicId, defaultPublicId2, User } from "../../db/model/user.model.js"
import path from "path";
import fs from 'fs'
import { hash } from "../../utils/hashing/hash.js";
import cloudinary from '../../utils/cloudinary/cloudinary.config.js'; 
export const updateUser=async(req,res,next)=>{
const {mobileNumber,DOB,firstName,lastName,Gender}=req.body;

   console.log(req.authuser._id);
   
    
      const user = await User.findById(req.authuser._id);
      if (!user) {
        next(new Error("user not found",{cause:400}))
      }
  
      if (mobileNumber !== undefined) {
        user.mobileNumber = mobileNumber;
      }
      if (DOB !== undefined) {
        user.DOB = DOB;
      }
      if (firstName !== undefined) {
        user.firstName = firstName;
      }
      if (lastName !== undefined) {
        user.lastName = lastName;
      }
      if (Gender !== undefined) {
        user.genders = Gender;
      }
    
      
      await user.save();
    
    return res.status(200).json({success:true,message:"updated successfully"})
    }
export const getLoginData=async(req,res,next)=>{
    const user=await User.findOne(req.authuser._id);
    return res.status(200).json({success:true,  name: user.firstName+ user.lastName, email: user.email, mobile: user.mobileNumber })
}
export const getProfile=async(req,res,next)=>{
    const user=await User.findOne(req.authuser._id).select('firstName lastName mobileNumber profile coverPic');
    return res.status(200).json({success:true, user})
}
export const updatePassword=async (req,res,next)=>{
  const user=await User.findById(req.authuser._id);
  const{password}=req.body;
  user.password = await hash({key:password,SALT_ROUNDS:8});
 await User.findByIdAndUpdate(req.authuser._id,user);
 res.status(201).json({success:true,message:"updated password"})
}
export const uploadProfilePicCloud = async (req, res,next) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.authuser._id; 
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });


    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }
    const newPublicId = user.profilePic?.public_id || `profile_${userId}`;
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: newPublicId,
      overwrite: true, // Ensure the old image is replaced
      folder: "profile_pics",
    });

    user.profilePic = {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
   const data= await user.save();

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "Profile picture updated", data: data });
};
export const uploadCoverPicCloud = async (req, res,next) => {
    if (!req.file) return next (new Error("no file to upload",{cause:400}))

    const userId = req.authuser._id; // Assuming you're using authentication middleware
    const user = await User.findById(userId);

    if (!user) return next(new Error("no user found",{cause:404}));

    if (user.coverPic && user.coverPic.public_id) {
      await cloudinary.uploader.destroy(user.coverPic.public_id);
    }

    const newPublicId = user.coverPic?.public_id || `profile_${userId}`;
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: newPublicId,
      overwrite: true, // Ensure the old image is replaced
      folder: "cover_pics",
    });

    user.coverPic = {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
   const data= await user.save();

    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "Profile picture updated", data: data });
};

export const deleteProfilePicCloud = async (req, res, next) => {
      if (!req.authuser.profilePic?.public_id) {
          return next(new Error("no image to delete",{cause:404}))
      }

      await cloudinary.uploader.destroy(req.authuser.profilePic.public_id);

      const user = await User.findByIdAndUpdate(
          req.authuser._id,
          { profilePic: { secure_url: "", public_id: "" } }, 
          { new: true }
      );

      return res.status(200).json({ success: true, message: "Profile picture deleted successfully", data: user });

};
export const deleteCoverPicCloud = async (req, res, next) => {
      if (!req.authuser.coverPic?.public_id) {
next(new Error("no image to delte",{cause:404}))
      }

      await cloudinary.uploader.destroy(req.authuser.coverPic.public_id);

      const user = await User.findByIdAndUpdate(
          req.authuser._id,
          { coverPic: { secure_url: "", public_id: "" } }, // إعادة تعيين الحقول
          { new: true }
      );

      return res.status(200).json({ success: true, message: "Profile picture deleted successfully", data: user });
};

export const deleteProfilepic=async (req,res,next)=>{
  if(req.authuser.profile!=deleteProfilepic)  
   { const fullpath=path .resolve(req.authuser.profile);
    fs.unlinkSync(fullpath)}
    await User.updateOne (
      {_id:req.authuser._id},
      {profile:defaultProfilePic}
    )
    return res.status(200).json({success:true,message:'image deleted successfully'})
  
  }
export const softDelete=async(req,res,next)=>{
  const user=await User.findByIdAndUpdate(req.authuser._id,{isDeleted:true})
  return res.status(201).json({success:true,message:"deleted succcessfully",})
}
