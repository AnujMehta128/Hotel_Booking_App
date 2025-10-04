const mongoose=require('mongoose');


const bookingSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'hotel',
        required:true
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'room',
        required:true
    },
    checkInDate:{
        type:Date,
        required:true
    },
    checkOutDate:{
        type:Date,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    guests:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending',"cancelled","confirmed"],
        default:"pending"
    },
    paymentMethod:{
        type:String,
        default:"Pay At Hotel",
        required:true
    },
    isPaymentDone:{
        type:Boolean,
        default:false
    }





},{timestamps:true});

const Booking=mongoose.model('booking',bookingSchema);

module.exports={
    Booking
}