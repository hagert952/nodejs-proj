import { Router } from "express";
import * as jobService from './jobs.service.js';
import * as jobValidation from './jobs.validation.js'
import {asyncHandler} from '../../utils/error handling/async-handler.js'
import  {isValid} from '../../middelwares/validation.middleware.js'
import { isAuthenticate } from "../../middelwares/auth.middleware.js";
import { isAuthorized } from "../../middelwares/authorization.middleware.js";
import { roles } from "../../db/model/enums/user.enums.js";


const router = Router({ mergeParams: true });
router.post('/',isAuthenticate,isValid(jobValidation.addJob),asyncHandler(jobService.addJob))
router.patch('/:jobId',isAuthenticate,isAuthorized(roles.JOBOWNER)
,asyncHandler(jobService.updateJob))
router.delete('/:jobId',isAuthenticate,asyncHandler(jobService.deleteJob))
router.get("/jobs/:companyId/:jobId?",asyncHandler(jobService.getcompjob))
router.get("/getJobs",asyncHandler(jobService.getJobs))
router.get("/users",isAuthenticate,isAuthorized(roles.USER),asyncHandler(jobService.allOrOne))
router.get("/:jobId/applications",asyncHandler(jobService.applicationsForJob))
router.post("/:jobId/apply",isAuthorized(roles.USER), isAuthenticate,asyncHandler(jobService.applyToJob))
router.patch("/:applicationId/status",  asyncHandler(jobService.rejectAccept))
export default router;
