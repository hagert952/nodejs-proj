import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/async-handler.js";
import * as applicationService from "../application/application.service.js"
import { isAuthenticate } from "../../middelwares/auth.middleware.js";
const router=Router()

router.post("/",isAuthenticate,asyncHandler(applicationService.post)) 

export default router;