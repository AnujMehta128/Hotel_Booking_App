const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    verifyOTP: {
        type: String,
        default: ''
    },
    verifyOTPExpiresAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOTP: {
        type: String,
        default: ''
    },
    resetOTPExpiresAt: {
        type: Number,
        default: 0
    },
    
    role: {
        type: String,
        enum: ["user", "hotelOwner"],
        default: "user"
    },
    recentSearchCities: 
        {
            type: [String],
            required: true,
            default:[]
        }
    



}, { timestamps: true })


const User = mongoose.model('user', userSchema);

module.exports = User