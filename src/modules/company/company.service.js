import { Company } from "../../db/model/company.js";
import cloudinary from "../../utils/cloudinary/cloudinary.config.js";
import fs from  'fs'
export const addCompany=async(req,res,next)=>{
const {companyName,companyEmail,description,industry,address}=  req.body;
const companyExist=await Company.findOne();
if(companyExist.companyEmail&&companyExist.companyName)
    return next(new Error('company email and company name already exists',{cause:400}),)
await Company.create({companyName:companyName,companyEmail:companyEmail,description:description,
  industry:industry,address:address});
res.status(201).json({success:true,message:"company add successfully"});
}
// export const updateCompany = async (req, res, next) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "No file uploaded" });
//         }

//         const { companyName, companyEmail,description,industry,address,numberOfEmployees

//             ,logo,HRs,bannedAt,deletedAt,approvedByAdmin
//          } = req.body;
         
//         const authUser = req.authuser;

//         // Define public_id to ensure only one image is saved per company
//         const publicId = `social-app/company/${authUser._id}/Cover-pic`;

//         // Upload image to Cloudinary using local file path
//         const result = await cloudinary.uploader.upload(req.file.path, {
//             public_id: publicId,
//             folder: `social-app/company/${authUser._id}/Cover-Pic`,
//             overwrite: true,
//             resource_type: "image",
//         });

//         // Delete temporary file after uploading
//         fs.unlinkSync(req.file.path);

//         // Update company record with new Cloudinary details
//         const updatedCompany = await Company.findOneAndUpdate(
//             { CreatedBy: authUser._id },
//             {
//                 coverPic: { secure_url: result.secure_url, public_id: result.public_id },
//                 companyName,
//                 companyEmail,description,industry,address,numberOfEmployees

//                 ,logo,HRs,bannedAt,deletedAt,approvedByAdmin
//             },
//             { new: true }
//         );

//         if (!updatedCompany) {
//             return res.status(404).json({ success: false, message: "Company not found" });
//         }

//         return res.status(200).json({ success: true, data: updatedCompany });
//     } catch (error) {
//         return next(error);
//     }
// };
export const updateCompany = async (req, res, next) => {
    
        if (!req.files || (!req.files.coverPic && !req.files.logo)
        ) {
            return next(new Error("no file uploaded",{cause:400}))
        }

        const { companyName, companyEmail,description,industry,address,numberOfEmployees

                        ,logo,HRs,bannedAt,deletedAt,approvedByAdmin } = req.body;
        const authUser = req.authuser;
        const updateFields = {};
const companyname=await Company.findOne({companyName})
if(companyname&&companyname.CreatedBy!=authUser._id )
    return next(new Error("companyName already exists",{cause:404}))
const companyemail=await Company.findOne({companyEmail})
if(companyemail&&companyemail.CreatedBy!=authUser._id)
    return next(new Error("companyEmail already exists",{cause:404}))
        if (req.files.coverPic) {
            const coverPicPath = req.files.coverPic[0].path;
            const coverPublicId = `social-app/company/${authUser._id}/Cover-pic`;
            const coverResult = await cloudinary.uploader.upload(coverPicPath, {
                public_id: coverPublicId,
                folder: `social-app/company/${authUser._id}/Cover-Pic`,
                overwrite: true,
                resource_type: "image",
            });
            fs.unlinkSync(coverPicPath);
            updateFields.coverPic = { secure_url: coverResult.secure_url, public_id: coverResult.public_id };
        }

        if (req.files.logo) {
            const logoPath = req.files.logo[0].path;
            const logoPublicId = `social-app/company/${authUser._id}/logo`;
            const logoResult = await cloudinary.uploader.upload(logoPath, {
                public_id: logoPublicId,
                folder: `social-app/company/${authUser._id}/logo`,
                overwrite: true,
                resource_type: "image",
            });
            fs.unlinkSync(logoPath);
            updateFields.logo = { secure_url: logoResult.secure_url, public_id: logoResult.public_id };
        }

        updateFields.companyName = companyName;
        companyName, companyEmail,description,industry,address,numberOfEmployees

//             ,logo,HRs,bannedAt,deletedAt,approvedByAdmin
        updateFields.companyEmail = companyEmail;
        updateFields.description = description;
        updateFields.industry = industry;
        updateFields.adress = address;
        updateFields.numberOfEmployees = numberOfEmployees;
        updateFields.HRs = HRs;
        updateFields.bannedAt = bannedAt;
        updateFields.deletedAt = deletedAt;

        const updatedCompany = await Company.findOneAndUpdate(
            { CreatedBy: authUser._id },
            updateFields,
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        return res.status(200).json({ success: true, data: updatedCompany });
  
};

export const SoftDelete= async (req, res,next) => {
  
    const companyId = req.params.id;

    const company = await Company.findByIdAndUpdate(companyId, 
      { deletedAt: new Date(),CreatedBy:req.authuser._id}, 
      { new: true }
    );

    if (!company) return next(new Error( "Company not found" ,{cause:404}))
    

    return res.status(200).json({ message: "Company soft deleted successfully", company });
}
export const specificCompanyJobs=async (req, res,next) => {

    const companyId = req.params.id;

    const company = await Company.findById(companyId)
      .populate("jobs") // Virtual populate


    if (!company) {
      return next(new Error( "Company not found" ,{cause:404}))
    }

    return res.status(200).json(company);
  
    // return res.status(500).json({ message: "Server error", error });
  
}
export const nameSearch=async (req, res,next) => {
    const { companyName } = req.query;

    if (!companyName) {
        return next(new Error( "Company name is required." ,{cause:400}))
    }

    // Perform case-insensitive search using regex
    const companies = await Company.find({
      companyName: { $regex: new RegExp(companyName, "i") }, // Case-insensitive match
    });

    if (companies.length === 0) {
        return next(new Error( "Company not found." ,{cause:400}))
    }

    return res.status(200).json(companies);
}
// uploadLogo
export const search= async (req, res,next) => {
    const { name } = req.query;
    if (!name) return next(new Error("Company name is required",{cause:400}))

    const company = await Company.findOne({ companyName: new RegExp(name, "i") });

    if (!company)     return next(new Error( "Company not found." ,{cause:404}))

    return res.status(200).json({ company });
}
export const uploadCoverPicCloud = async (req, res, next) => {
        if (!req.file) {
            return next(new Error("No file uploaded",{cause:400}))
        }

        const { companyName, companyEmail } = req.body;
        const authUser = req.authuser;

        // Define public_id to ensure only one image is saved per company
        const publicId = `social-app/company/${authUser._id}/Cover-pic`;

        // Upload image to Cloudinary using local file path
        const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: publicId,
            folder: `social-app/company/${authUser._id}/Cover-Pic`,
            overwrite: true,
            resource_type: "image",
        });

        // Delete temporary file after uploading
        fs.unlinkSync(req.file.path);

        // Update company record with new Cloudinary details
        const updatedCompany = await Company.findOneAndUpdate(
            { CreatedBy: authUser._id },
            {
                coverPic: { secure_url: result.secure_url, public_id: result.public_id },
                companyName,
                companyEmail,
            },
            { new: true }
        );

        if (!updatedCompany) {
            return next(new Error( "Company not found" ,{cause:404}))
        }

        return res.status(200).json({ success: true, data: updatedCompany });
        return next(error);
};
export const uploadlogoCloud = async (req, res, next) => {
        if (!req.file) {
            return next(new Error("file not found",{cause:400}))
        }

        const { companyName, companyEmail } = req.body;
        const authUser = req.authuser;

        // Define public_id to ensure only one image is saved per company
        const publicId = `social-app/company/${authUser._id}/logo`;

        // Upload image to Cloudinary using local file path
        const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: publicId,
            folder: `social-app/company/${authUser._id}/logo`,
            overwrite: true,
            resource_type: "image",
        });

        // Delete temporary file after uploading
        fs.unlinkSync(req.file.path);

        // Update company record with new Cloudinary details
        const updatedCompany = await Company.findOneAndUpdate(
            { CreatedBy: authUser._id },
            {
                logo: { secure_url: result.secure_url, public_id: result.public_id },
                companyName,
                companyEmail,
            },
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        return res.status(200).json({ success: true, data: updatedCompany });

};




//       if (!req.file) {
//           return res.status(400).json({ success: false, message: "No file uploaded" });
//       }

//       const { companyName, companyEmail } = req.body;
//       const authUser = req.authuser;

//       // Define a fixed public_id to ensure only one image is saved per company
//       const publicId = `social-app/company/${authUser._id}/Cover-pic`;

//       // Define Cloudinary upload options
//       let options = {
//           public_id: publicId,  // Fixed public_id for overwriting
//           folder: `social-app/company/${authUser._id}/Cover-Pic`, // Organize inside the user folder
//           overwrite: true,  // Ensure replacement
//           resource_type: "image"
//       };

//       // Upload image to Cloudinary using upload_stream
//       const uploadStream = cloudinary.uploader.upload_stream(options, async (error, result) => {
//           if (error) {
//               return next(error);
//           }

//           try {
//               // Update the company record with new Cloudinary details
//               const updatedCompany = await Company.findOneAndUpdate(
//                   { CreatedBy: authUser._id },
//                   {
//                       coverPic: { secure_url: result.secure_url, public_id: result.public_id },
//                       companyName,
//                       companyEmail
//                   },
//                   { new: true }
//               );

//               if (!updatedCompany) {
//                   return res.status(404).json({ success: false, message: "Company not found" });
//               }

//               return res.status(200).json({ success: true, data: updatedCompany });
//           } catch (dbError) {
//               return next(dbError);
//           }
//       });

//       // Pass the file buffer to Cloudinary upload stream
//       uploadStream.end(req.file.buffer);

// };
export const deleteCoverPicCloud = async (req, res, next) => {
      const authUser = req.authuser;

      const company = await Company.findOne({ CreatedBy: authUser._id });

      if (!company) {
          return next(new Error("company not found",{cause:404}))
      }

      if (!company.coverPic?.public_id) {
        return next(new Error( "No cover picture to delete",{cause:400
        }))
  
      }

      console.log("Deleting cover image with public_id:", company.coverPic.public_id);

          const cloudinaryImage = await cloudinary.api.resource(company.coverPic.public_id);
          if (!cloudinaryImage) {
              return next(new Error("cloudinary image not found",{cause:400}));
          }

      const cloudinaryResponse = await cloudinary.uploader.destroy(company.coverPic.public_id);

      console.log("Cloudinary delete response:", cloudinaryResponse);

      if (cloudinaryResponse.result !== "ok") {
        return next(new Error( "Failed to delete cover picture from Cloudinary",{cause:500}))
      }

      const updatedCompany = await Company.findOneAndUpdate(
          { CreatedBy: authUser._id },
          { coverPic: { secure_url: "", public_id: "" } }, // إزالة بيانات الصورة
          { new: true }
      );

      return res.status(200).json({ success: true, message: "Cover picture deleted successfully", data: updatedCompany });

      
};
export const deletelogoCloud= async (req, res, next) => {
      const authUser = req.authuser;

      const company = await Company.findOne({ CreatedBy: authUser._id });

      if (!company) {
        return next(new Error("Company not found",{cause:404}))
      }

      if (!company.logo?.public_id) {
        return next(new Error( "No cover picture to delete",{cause:400}))
      }


   
          const cloudinaryImage = await cloudinary.api.resource(company.logo.public_id);
          if (!cloudinaryImage) {
              return next(new Error(""))
          }
 
        

      const cloudinaryResponse = await cloudinary.uploader.destroy(company.logo.public_id);

      console.log("Cloudinary delete response:", cloudinaryResponse);

   

      const updatedCompany = await Company.findOneAndUpdate(
          { CreatedBy: authUser._id },
          { logo: { secure_url: "", public_id: "" } }, 
          { new: true }
      );

      return res.status(200).json({ success: true, message: "Cover picture deleted successfully", data: updatedCompany });

  
};



