import { Router } from "express";
import { isAuthenticate } from "../../middelwares/auth.middleware.js";
import { isValid } from "../../middelwares/validation.middleware.js";
import * as userValidation from '../user/user.validation.js';
import { asyncHandler } from "../../utils/error handling/async-handler.js";
import * as userService from '../user/user.service.js';
import  {  } from '../../utils/file uploads/multer.js';
import { cloudUpload, fileValidation } from "../../utils/file uploads/multer-cloud.js";
const  router = Router();
router.patch('/',isAuthenticate,asyncHandler(userService.updateUser));
router.get("/",isAuthenticate,asyncHandler(userService.getLoginData))
router.get("/get-profile",isAuthenticate,asyncHandler(userService.getProfile))
router.patch("/update-password",isAuthenticate,isValid(userValidation.updatePassword),asyncHandler(userService.updatePassword))
router.post(
    "/upload/profile-pic",
    isAuthenticate,
    cloudUpload(fileValidation.images).single("images"),
    asyncHandler(userService.uploadProfilePicCloud)
);
router.post(
    "/Cover-pic",
    isAuthenticate,
    cloudUpload(fileValidation.images).single("images"),
   userService. uploadCoverPicCloud
);
router.delete("/profile-pic", isAuthenticate, asyncHandler(userService.deleteProfilePicCloud));
router.delete("/cover-pic", isAuthenticate, asyncHandler(userService.deleteCoverPicCloud));

router.patch('/deleteAccount',isAuthenticate,asyncHandler(userService.softDelete))

export default router;