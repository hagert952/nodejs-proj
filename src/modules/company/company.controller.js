import { Router } from "express";
import * as companyService from './company.service.js';
import * as companyValidation from './company.validation.js'
import {asyncHandler} from '../../utils/error handling/async-handler.js'
import  {isValid} from '../../middelwares/validation.middleware.js'
import { isAuthenticate } from "../../middelwares/auth.middleware.js";
import { isAuthorized } from "../../middelwares/authorization.middleware.js";
import { roles } from "../../db/model/enums/user.enums.js";
import { cloudUpload, fileValidation } from "../../utils/file uploads/multer-cloud.js";

const router=Router()
router.post('/',isValid(companyValidation.addCompany),asyncHandler(companyService.addCompany))
router.post('/l/l',isAuthenticate,   isAuthorized(roles.OWNER),cloudUpload(fileValidation.images).fields([
    { name: "coverPic", maxCount: 1 },
    { name: "logo", maxCount: 1 }
]),asyncHandler(companyService.updateCompany))
//all data except legal
// router.patch('/',)
router .delete('/:id',isAuthenticate,isAuthorized(roles.OWNER,roles.ADMIN),isValid(fileValidation.SoftDelete),asyncHandler(companyService.SoftDelete))
router .get('/:id',asyncHandler(companyService.specificCompanyJobs))
router .get("/",asyncHandler(companyService.nameSearch))
router.get("/search-company",asyncHandler(companyService.search))
router.post(
    "/Cover-pic",
    isAuthenticate,
    cloudUpload(fileValidation.images).single("images"),
    asyncHandler(companyService.uploadCoverPicCloud)
);
router.post(
    "/logo",
    isAuthenticate,
    cloudUpload(fileValidation.images).single("images"),
    asyncHandler(companyService.uploadlogoCloud)
);
router.delete('/', isAuthenticate, asyncHandler(companyService.deleteCoverPicCloud));
router.delete('/logo/delete', isAuthenticate, asyncHandler(companyService.deletelogoCloud));

// router.post("/",isAuthenticate,
//     // isAuthorized(resolveHostname.User),
// cloudUpload(fileValidation.images).array("attachment",5)
// // isValid(postValidation.createPost)
// ,asyncHandler(postservice.uploadLogo)
// // ,isValid(postValidation.createPost)
// );
export default router;