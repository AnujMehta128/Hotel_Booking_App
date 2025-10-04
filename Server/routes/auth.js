const express=require('express');
const { handleRegisterNewUserRequest, handleLoginRequest, handleLogoutRequest, handleSendOTPRequestForVerification, handleVerificationOfOTP, handleSendOTPForPasswordReset, handleVerificationOfOTPSendForPasswordReset, isAuthenticated } = require('../controllers/auth');
const { authenticateUser } = require('../middleware/authentication');

const router=express.Router();


router.post('/signup',handleRegisterNewUserRequest);
router.post('/login',handleLoginRequest)
router.post('/logout',handleLogoutRequest)
router.post('/verify-email-send-otp',authenticateUser,handleSendOTPRequestForVerification);
router.post('/verify-email-verify-otp',authenticateUser,handleVerificationOfOTP);
router.post('/send-password-reset-otp',handleSendOTPForPasswordReset);
router.post('/verify-otp-send-for-password-reset',handleVerificationOfOTPSendForPasswordReset);
router.get('/is-auth',authenticateUser,isAuthenticated);

module.exports={
    router
}