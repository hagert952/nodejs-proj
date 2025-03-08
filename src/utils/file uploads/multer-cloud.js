import fs from"fs";
import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid";
import path from "path";
// import cloudinary from "../cloudinary/cloudinary.config.js";
// const { v4: uuidv4 } = require('uuid');
// import { v4 as uuidv4 } from 'uuid';
export const fileValidation={
    images:["image/jpg","image/png"]
    ,files:["application/pdf"],
    videos:["video/mp4"],
}




export const cloudUpload=(allowedFiles)=>{

    const storage =diskStorage({  });
    const fileFilter=(req,file,cb)=>{
if(!allowedFiles.includes(file.mimetype)){
        return cb(new Error("invalid file format"),false);
    } 
    cb(null, true);
}
    return multer({storage,fileFilter})
}



// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const uploadToCloudinary = (req, res, next) => {
//     if (!req.file) return next();
  
//     cloudinary.uploader.upload_stream({ public_id: uuidv4() }, (error, result) => {
//       if (error) return next(error);
  
//       req.image = {
//         public_id: result.public_id,
//         secure_url: result.secure_url,
//       };
  
//       next();
//     }).end(req.file.buffer);
//   };
  
// //   export {  uploadToCloudinary,upload };
  
// // const storage=multer.memoryStorage();
// // export  const upload =multer ({storage})

// // module.exports={uploadcloudinary,fileUpload}
// import express from 'express';
// import multer from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import cloudinary from "../cloudinary/cloudinary.config.js"; 
// export const fileValidation={
//     images:["image/jpg","image/png"]
//     ,files:["application/pdf"],
//     videos:["video/mp4"],
// }
// export const cloudUpload = (allowedFiles) => {
//     const storage = multer.memoryStorage(); // تغيير إلى memoryStorage()
//     const fileFilter = (req, file, cb) => {
//         if (!allowedFiles.includes(file.mimetype)) {
//             return cb(new Error("Invalid file format"), false);
//         }
//         cb(null, true);
//     };
//     return multer({ storage, fileFilter });
// };




// import express from 'express';import fs from "fs";
// import multer from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import cloudinary from "../cloudinary/cloudinary.config.js"; 
// export const fileValidation={