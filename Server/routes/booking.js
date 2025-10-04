const express=require('express');
const { checkAvailablityAPI, createNewBooking, getAllBookingsByAUser, getAllBookingsOfAOwner } = require('../controllers/booking');
const { authenticateUser } = require('../middleware/authentication');

const router=express.Router();

router.post('/check-availability',checkAvailablityAPI);
router.post('/book',authenticateUser,createNewBooking);
router.get('/user',authenticateUser,getAllBookingsByAUser);
router.get('/:hotelId/owner',authenticateUser,getAllBookingsOfAOwner);

module.exports={
    router
}