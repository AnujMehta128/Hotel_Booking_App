const express=require('express');
const { authenticateUser } = require('../middleware/authentication');
const { handleRegisterNewHotelRequest, handleOwnerHotel } = require('../controllers/hotel');
const router=express.Router();

router.post('/register-hotel',authenticateUser,handleRegisterNewHotelRequest);
router.get('/owner-hotels',authenticateUser,handleOwnerHotel)

module.exports={
    router
}