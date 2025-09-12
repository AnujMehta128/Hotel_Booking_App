const {Router}=require('express');
const { handleGetUserRequest, handleStoringRecentSearchedCities } = require('../controllers/user');
const { authenticateUser } = require('../middleware/authentication');

const router=Router();

router.get('/get-user',authenticateUser,handleGetUserRequest);
router.post('/store-recent-city',authenticateUser,handleStoringRecentSearchedCities);

module.exports={
    router
}