const {Schema,model}=require('mongoose');

const roomSchema=new Schema({
  
   hotel:{
    type:Schema.Types.ObjectId,
    ref:'hotel',
    required:true
   },
   roomType:{
    type:String,
    required:true
   },
   pricePerNight:{
    type:Number,
    required:true
   },
   amenities:{
    type:Array,
    required:true
   },
   images:[{type:String}],
   isAvailabel:{
    type:Boolean,
    default:true
   }


},{timestamps:true});


const Room=model('room',roomSchema);

module.exports={
    Room
}