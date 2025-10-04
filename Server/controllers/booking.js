const { transporter } = require("../configs/nodemailer");
const { Booking } = require("../models/booking");
const { Hotel } = require("../models/hotel");
const { Room } = require("../models/room");
const User = require("../models/User");

async function checkAvailablity(checkInDate,checkOutDate,room){
 
    try{
    
    const bookings=await Booking.find({
        room,
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
        const room=req.body.roomId;

        const isAvailabel=await checkAvailablity(checkInDate,checkOutDate,room)
       
        
            return res.json({
                success:true,
                isAvailabel,
                message:isAvailabel ? "Room is available" : "Room is not available"
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
        
        const {checkInDate,checkOutDate,guests,paymentMethod}=req.body;
        const room=req.body.roomId;
        const userId=req.user.id;

        // for sending email we have the user id we need its email
        const user=await User.findById(userId);
        
        const isAvailabel=await checkAvailablity(checkInDate,checkOutDate,room);

        if(!isAvailabel)
        {
            return res.json({
                success:false,
                message:"Room Is Not availabel"
            })
        }

        const roomData=await Room.findById(room).populate('hotel');

        let totalPrice=roomData.pricePerNight;

        const checkIn=new Date(checkInDate);
        const checkOut=new Date(checkOutDate);

        const timeDiff=(checkOut.getTime()-checkIn.getTime());
        const nights=Math.ceil(timeDiff/(60*60*1000*24));

        totalPrice=totalPrice*nights

        const booking =await Booking.create({
            userId,
            hotel:roomData.hotel._id,
            room,
            guests:+guests,
            checkInDate,
            checkOutDate,
            totalPrice,
            paymentMethod

        })



        // booking confirmation email

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Hotel Booking Details',
            html: `
                  <h2>Your Booking Details</h2>
                  <p> Dear ${user.userName}</p>
                  <p> Thank you for your booking! Here are your details:</p>
                  <ul>
                  <li> <strong>Booking Id:</strong>${booking._id}</li>
                   <li> <strong>Hotel Name:</strong>${roomData.hotel.hotelName}</li>
                     <li> <strong>Location:</strong>${roomData.hotel.hotelAddress}</li>
                     <li> <strong>Date:</strong>${booking.checkInDate.toDateString()}</li>
                     <li><strong>Amount:</strong> ${process.env.CURRENCY || '$'}  ${booking.totalPrice}/night</li>
                     </ul>

                     <p>We look forward to welcome you !</p>
                     <p>If you need to make any changes, feel free to contact us.</p>
              `}

        await transporter.sendMail(mailOptions) 

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
        
      const hotel=await Hotel.findOne({hotelOwner:req.user.id,_id:req.params.hotelId});
      if(!hotel)
      {
        return res.json({
            success:false,
            message:"No Hotel Found"
        })
      }

      const bookings=await Booking.find({hotel:hotel._id}).populate('room hotel userId').sort({createdAt:-1});

      const totalBookings=bookings.length;
      const totalRevenue=bookings.reduce((acc,booking)=>{
           return acc+booking.totalPrice
      },0);

      return res.json({
        success:true,
        dashboardData:{
            totalBookings,
            totalRevenue,
            bookings
        }
      })





    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports={
    checkAvailablityAPI,
    createNewBooking,
    getAllBookingsByAUser,
    getAllBookingsOfAOwner
    
}