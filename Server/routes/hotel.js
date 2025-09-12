const express=require('express');
const { authenticateUser } = require('../middleware/authentication');
const { handleRegisterNewHotelRequest } = require('../controllers/hotel');
const router=express.Router();

router.post('/register-hotel',authenticateUser,handleRegisterNewHotelRequest);

module.exports={
    router
}