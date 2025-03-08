import { Router } from "express";
import * as authService from './auth.service.js';
import * as authvalidation from './auth.validation.js'
import {asyncHandler} from '../../utils/error handling/async-handler.js'
import  {isValid} from '../../middelwares/validation.middleware.js'
import { isAuthenticate } from "../../middelwares/auth.middleware.js";

const router=Router()

router.post('/signup',isValid(authvalidation.signup),asyncHandler(authService.signUp))
router.post('/confirm-otp',isValid(authvalidation.confirmOtp),asyncHandler(authService.confirmOtp))
router.post('/signin',isValid(authvalidation.signIn),asyncHandler(authService.signIn))
router.post('/google-login',asyncHandler(authService.googleLogin))
router.patch('/forgetPassword',isValid(authvalidation.forgetPassword),asyncHandler(authService. forgetPassword));
router.patch('/reset-password',isValid(authvalidation.resetPassword),asyncHandler(authService.resetPassword))
router.post ('/refresh-token',isAuthenticate,isValid(authvalidation.refreshToken),asyncHandler(authService.refreshToken))
export default router;