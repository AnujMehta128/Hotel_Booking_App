const {Router}=require('express');
//const { authenticateHotel } = require('../middleware/authentication');
const { handleCreateRoomRequest, getAllRooms, getAllOwnerRoomsForOneHotel, toggleRoomAvailablity } = require('../controllers/room');
const { upload } = require('../middleware/uploadmiddleware');
const { authenticateUser } = require('../middleware/authentication');

const router=Router();

router.post('/:hotelId/register-new-room', upload.array("images",4),authenticateUser,handleCreateRoomRequest);
router.get('/',getAllRooms);
router.get('/:hotelId/all-owner-rooms',authenticateUser,getAllOwnerRoomsForOneHotel);
router.post('/update-room-availability',authenticateUser,toggleRoomAvailablity)

module.exports={
    router
}