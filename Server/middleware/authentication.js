
const jwt=require('jsonwebtoken')


async function authenticateUser(req,res,next)
{
    const cookieValue=req.cookies?.usertoken;
    if(!cookieValue)
    {
        return res.json({
            success:false,
            message:"User is Not Signed Up or Logged In"
        })
        
    }
    try{

    const payload=jwt.verify(cookieValue,process.env.JWT_SECRET);
    //console.log(req.body); // this comes out to be undefined on verify -email-send otp route as 
    // no body is sent in post request 
    // req.user is a custom property of the req object
    req.user=payload;
    next();
    }
    catch(error)
    {
        return res.json({
            success:false,
            message:error.message
        })
    }
}


/*async function authenticateHotel(req,res,next)
{
    try{
    const hotelTokenValue=req.cookies?.hotelToken;
    if(!hotelTokenValue)
    {
        return res.json({
            success:false,
            message:"Hotel Is Not Registered Yet"
        })
    }
    
    const payload=jwt.verify(hotelTokenValue,process.env.JWT_SECRET);
    req.hotel=payload;
    next();
    }
    catch(error)
    {
        return res.json({
            success:false,
            message:error.message
        })
    }
}*/

module.exports={
    authenticateUser,
   /* authenticateHotel*/
}