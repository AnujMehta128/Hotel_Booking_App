const mongoose=require('mongoose');


async function handleMongodbConnectionRequest()
{
   
   try {
     mongoose.connection.on('connected',()=>{console.log("mongodb connected")});
     await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking-application`)

   
    } catch (error) {
       console.log(error.message); 
   }
   



}

module.exports={
    handleMongodbConnectionRequest
}