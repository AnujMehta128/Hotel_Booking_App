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
app.use(cookieparser())

handleMongodbConnectionRequest();
connectClodinary();


app.get('/',(req,res)=>{
    res.send("Hi")
})

app.use('/auth',authRouter)
app.use('/user',userRouter);
app.use('/hotel',hotelRouter)
app.use('/room',roomRouter) 
app.use('/booking',bookingRouter);


app.listen(PORT,(()=>{
    console.log("server started");
}))