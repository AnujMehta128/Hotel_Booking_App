const { Hotel } = require("../models/hotel");
const {v2:cloudinary}=require('cloudinary');
const { Room } = require("../models/room");


async function handleCreateRoomRequest(req,res)
{
    try {
        const{roomType,pricePerNight,amenities}=req.body;
        const hotelId=req.params.hotelId;
        const hotelOwner=req.user.id;

        const hotel=await Hotel.findOne({hotelOwner,_id:hotelId});

        if(!hotel)
        {
            return res.json({
                success:false,
                message:"No Hotel Found"
            })
        }
        
        const uploadImages=req.files.map(async (file)=>{
          
         const response= await cloudinary.uploader.upload(file.path);
          return response.secure_url;
        })

        const images=await Promise.all(uploadImages);

       await Room.create({
          hotel:hotelId,
          roomType,
          pricePerNight:+pricePerNight,
          amenities:JSON.parse(amenities),
          images

       })

      return res.json({
        success:true,
        message:"Room Registered Successfully"
       })

    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

// to display all the availabel rooms to a user

async function getAllRooms(req,res)
{
    try{
    const rooms=await Room.find({isAvailabel:true}).populate({
        path:'hotel',
        populate:{
            path:'hotelOwner'
        }
    }).sort({createdAt:-1})

    res.json({success:true,rooms});
}
catch(error){
    return res.json({
        success:false,
        message:error.message
    })
}
}

// to display all the rooms of a owner

async function getAllOwnerRoomsForOneHotel(req,res)
{
    try {
        const hotel=await Hotel.findOne({hotelOwner:req.user.id,_id:req.params.hotelId});
       /* const hotel=hotelData.find((hotel)=>{
          return  hotel._id.toString()===req.params.hotelId;
            
        })*/

          if(!hotel)
          {
            return res.json({
                success:false,
                message:"Hotel Not Found owned by you"
            })
          }

        const rooms= await Room.find({hotel:hotel._id}).populate('hotel');

        return res.json({
            success:true,
            rooms,
        })

    } catch (error) {

        return res.json({
            success:false,
            message:error.message
        })
        
    }
}


async function toggleRoomAvailablity(req,res)
{
    try {
        const {roomId}=req.body;
        const roomData=await Room.findById(roomId).populate('hotel');
        
        if(roomData.hotel.hotelOwner.toString()!==req.user.id)
        {
            return res.json({
                success:false,
                message:"You Cannot Update Room Availabilty"
            })
        }

        if(!roomData)
        {
            return res.json({
                success:false,
                message:"Room Not Found"
            })
        }

        roomData.isAvailabel=!roomData.isAvailabel;

        await roomData.save();

       return res.json({
            success:true,
            message:"Room availabilty Updated"
        })


         

    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}



module.exports={
    handleCreateRoomRequest,
    getAllRooms,
    getAllOwnerRoomsForOneHotel,
    toggleRoomAvailablity


}