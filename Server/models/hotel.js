const {Schema,model}=require('mongoose');

const hotelSchema=new Schema({
   hotelName:{
    type:String,
    required:true
   },
   hotelAddress:{
     type:String,
     required:true,
   },
   hotelContact:{
    type:String,
    required:true,
   },
   hotelOwner:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true
   },
   hotelCity:{
    type:String,
    required:true
   },
   houseNumber:{
    type:String,
    required:true
   },
   buildingName:{
    type:String
   },
   floor:{
    type:Number
   },
   street:{
    type:String,
    required:true
   },
   locality:{
    type:String,
    required:true
   },
   pincode:{
    type:Number,
    required:true
   },
   normalizedHotelAddress:{
    type:String,
    required:true,
    index:true
    },
    isStandalone:{
        type:Boolean,
        default:false
    }

},{timestamps:true});


const Hotel=model('hotel',hotelSchema);

module.exports={
    Hotel
}
