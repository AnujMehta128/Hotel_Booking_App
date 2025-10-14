const express=require('express');
const cors=require('cors');
const { handleMongodbConnectionRequest } = require('./configs/connection');
require('dotenv').config();
const cookieparser=require('cookie-parser');

const {router:authRouter}=require('./routes/auth')
const {router:userRouter}=require('./routes/user')
const {router:hotelRouter}=require('./routes/hotel');
const {router:roomRouter}=require('./routes/room')
const {router:bookingRouter}=require('./routes/booking');


const { connectClodinary } = require('./configs/cloudinary');

const PORT=process.env.PORT|| 3000;

const app=express();

const allowedOrigins=['http://localhost:5173','https://quickstay-smoky-mu.vercel.app'];

app.use(cors({origin:allowedOrigins,credentials:true}));
app.use(express.json());
app.use(cookieparser());

/*const connectDB=async()=>{
    try {
        await handleMongodbConnectionRequest();
    } catch (error) {
        console.log(error.message);
    }
}
const connect=await connectDB();*/


connectClodinary();


app.get('/',(req,res)=>{
    res.send("Hi")
})

app.use('/auth',authRouter)
app.use('/user',userRouter);
app.use('/hotel',hotelRouter)
app.use('/room',roomRouter) 
app.use('/booking',bookingRouter);

(async () => {
  try {
    await handleMongodbConnectionRequest();
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1); // Prevent running without DB
  }
})();