const mongoose=require('mongoose');


async function handleMongodbConnectionRequest()
{
    await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking-application`)
    .then(()=>{console.log("mongodb connected")})
    .catch((err)=>{console.log("mongo error :",err)});

}

module.exports={
    handleMongodbConnectionRequest
}