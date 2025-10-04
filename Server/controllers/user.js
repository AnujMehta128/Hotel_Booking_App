const User = require("../models/User");

async function handleGetUserRequest(req,res)
{
    const userId=req.user.id;
    if(!userId)
    {
        return res.json({
            success:false,
            message:"User must SignUp or Already Has an account Login"
        })
    }
    try{
    const user=await User.findById(userId);
    // console.log(userId);
    // console.log(user);
    return res.json({
        success:true,
        userData:{
            role:user.role,
            recentSearchCities:user.recentSearchCities,
            isAccountVerified:user.isAccountVerified,// for the login icon
            userName:user.userName// for login icon

        }
    })
}
catch(error)
{
    return res.json({
        success:false,
        message:error.message
    })
}
}

async function handleStoringRecentSearchedCities(req,res)
{
   try {
    const userId=req.user.id;
    const {recentSearchCity}=req.body;

    if(!userId)
    {
        return res.json({
            success:false,
            message:"User Not Authenticated"
        })
    }
    const user=await User.findById(userId);

    if(user.recentSearchCities.length<3)
    {
        user.recentSearchCities.push(recentSearchCity);
    }
    else
    {
        user.recentSearchCities.shift().push(recentSearchCity);
    }
     
    user.save();
    return res.json({
        success:true,
        message:{
            role:user.role,
            recentSearchCities:user.recentSearchCities
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
    handleGetUserRequest,
    handleStoringRecentSearchedCities
}