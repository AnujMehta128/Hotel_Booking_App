const { Booking } = require("../models/booking");
const { Room } = require("../models/room");

async function checkAvailablity(checkInDate,checkOutDate,roomId){
 
    try{
    
    const bookings=await Booking.find({
        roomId,
        checkInDate:{$lte:checkOutDate},
        checkOutDate:{$gte:checkInDate}
    
    });

       const isAvailabel=bookings.length===0?true:false;
       return isAvailabel
    }
    catch(error)
    {
     console.log(error.message)
    }

}




// to check availablity of a room

async function checkAvailablityAPI(req,res)
{
     try {
        
        const{checkInDate,checkOutDate}=req.body;
        const roomId=req.params.roomId;

        const isAvailabel=await checkAvailablity(checkInDate,checkOutDate,roomId)
       
        
            return res.json({
                success:true,
                message:isAvailabel
            })
        



     } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
     }
}



// to book a room


async function createNewBooking(req,res)
{
    try {
        
        const {checkInDate,checkOutDate,guests}=req.body;
        const roomId=req.params.roomId;
        const userId=req.params.id;
        
        const isAvailabel=checkAvailablity(checkInDate,checkOutDate,roomId);

        if(!userId)
        {
            return res.json({
                success:false,
                message:"Room Is Not availabel"
            })
        }

        const roomData=await Room.findById(roomId).populate('hotel');

        let totalPrice=roomData.pricePerNight;

        const checkIn=new Date(checkInDate);
        const checkOut=new Date(checkOutDate);

        const timeDiff=(checkOut.getTime()-checkIn.getTime());
        const nights=Math.ceil(timeDiff/(60*60*1000*24));

        totalPrice=totalPrice*nights

        const booking =await Booking.create({
            userId,
            hotelId:roomData.hotel._id,
            roomId,
            guests:+guests,
            checkInDate,
            checkOutDate,
            totalPrice

        })

        return res.json({
            success:true,
            message:"Booking Done Successfully"
        })


    } catch (error) {
        
        return res.json({
            success:false,
            message:error.message
        })
    }
}


// to get all booking of a user

async function getAllBookingsByAUser(req,res)
{
    try {
         
        const userId=req.user.id;
        const bookings= await Booking.find({userId}).populate('room hotel').sort({createdAt:-1});

         return res.json({
            success:true,
            bookings
         })


    } catch (error) {
        
        return res.json({success:false,
            message:"Failed to Fetch Bookings"
    })
    }
}


// to get all booking of  a owner 

async function getAllBookingsOfAOwner(req,res)
{
    try {
        




    } catch (error) {
        
    }
}