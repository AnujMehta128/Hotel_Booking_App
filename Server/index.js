const express=require('express');
const cors=require('cors');
const { handleMongodbConnectionRequest } = require('./configs/connection');
require('dotenv').config();
const cookieparser=require('cookie-parser');

const {router:authRouter}=require('./routes/auth')
const {router:userRouter}=require('./routes/user')
const {router:hotelRouter}=require('./routes/hotel');
const {router:roomRouter}=require('./routes/room')


const { connectClodinary } = require('./configs/cloudinary');

const PORT=3000;

const app=express();

app.use(cors());
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


app.listen(PORT,(()=>{
    console.log("server started");
}))