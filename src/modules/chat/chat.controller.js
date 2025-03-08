import { Router } from "express";
import { isAuthenticate } from "../../middelwares/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/async-handler.js";
import * as chatService from './chat.service.js';
import { isValid } from "../../middelwares/validation.middleware.js";
import * as chatvalidation from '../chat/chat.validation.js';
const router=Router()
router.post("/sendm",
    isAuthenticate,
    asyncHandler(chatService.sendMessage)
)
router.post('/send', isAuthenticate,isValid(chatvalidation.sendMessage),asyncHandler(chatService.send))

// router.get("/:friendId",isAuthenticate,asyncHandler(chatService.getAll))
export default router;