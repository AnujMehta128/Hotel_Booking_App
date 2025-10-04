const  User = require("../models/User");
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken'); 
const { transporter } = require("../configs/nodemailer");
const { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } =require("../configs/emailTemplates");

async function handleRegisterNewUserRequest(req,res)
{
    //console.log("req.body:", req.body);
    
    const {email,userName,password}=req.body;
    if(!email|| !userName|| !password)
    {
        return res.json({sucsess:false,
            message: 'Details Required'
        })
    }

    try 
    {
      
     const exsistingUser=await User.findOne({email});

      if(exsistingUser)
      {
        return res.json({
            success:false,
            message: 'User Already Exists'
        })
      }


      const hashedPassword= await bcrypt.hash(password,10);

      const user=await User.create({
        userName,
        password:hashedPassword,
        email,
      })
     
      const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'7d',

      })

      res.cookie('usertoken',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
        maxAge:7*24*60*60*1000
      })

      const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:"Welcome to Hotel Booking Application",
        text:`Welcome to Hotel Booking Website ${userName} your account has been created 
        with the email ${email}`
      }
      await transporter.sendMail(mailOptions);
       
 
 return res.json({
            sucsess:true,
            message: 'User Registered Successfully'
        })

        
    } catch (error) {

        return res.json({
            success:false,
            message:error.message
        })
        
    } 
}



async function handleLoginRequest(req,res)
{ 
   const {email,password}=req.body

   if(!email || !password)
   {
    return res.json({
        success:false,
        message:'email and password are required'
    })
   }

   try {

    const existingUser= await User.findOne({email});


    if(!existingUser)
    {
        return res.json({
            success:false,
            message:'Invalid Email '
        })
    }
    if(existingUser)
    {
        
        const userGivenPassword=password
         
        const registeredHashedPassword=existingUser.password;

        const isPasswordMatch =await bcrypt.compare(userGivenPassword, registeredHashedPassword)

        if(isPasswordMatch)
        {
            
             const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{
                expiresIn:'7d'
             })

             res.cookie('usertoken',token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:process.env.NODE_ENV==='production'?'none':'strict',
                maxAge:7*24*60*60*1000
             })
            
            
            
            
            
            
            return res.json({
                success:true,
                message:"User Already Exists"
            })
        }
        else
        {
            return res.json({
                    success:false,
                    message:"Invalid Password"
                })
            
        }

    }
}

    catch(error)
    {
     return res.json({
        success:false,
        message:error.message
     })
    }
        
}

    async function handleLogoutRequest(req,res)
    {
        res.clearCookie('usertoken',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60,
        })


        return res.json({
            success:true,
            message:"User Logged Out"
        })
    }
    
async function handleSendOTPRequestForVerification(req,res)
{
    try {

        const userId=req.user.id;// req.user is a custom property
        // to take out the user details sent from the authentication middleware 
    
        const user=await User.findById(userId);
        
        if(user.isAccountVerified)
        {
            return res.json({
                success:false,
                message:"Account Already Verified"
            })
        }
       const OTP=String(Math.floor(100000+ Math.random()*900000));

       user.verifyOTP=OTP;
       user.verifyOTPExpiresAt= Date.now()+ 2*60*1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "OTP for Email Verification at Hotel Booking Application",
            text: `Your OTP (One Time Password) to verify your Email Address ${user.email} is
            ${user.verifyOTP} it expires in 2 mins `,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",user.verifyOTP).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOptions);

        return res.json({
            success:true,
            message:"OTP sent"
        })
        
    } catch (error) {

        return res.json({
            success:false,
            message:error.message
        })
        
    }
}


async function handleVerificationOfOTP(req,res)
{
    const userId=req.user.id; // from authentication middleware req.user is set to payload 
    const OTPEntered=req.body.otp;

    if(!userId || !OTPEntered)
    {
        return res.json({
            success:false,
            message:"Missing Details"
        })
    }
     try {
   
           const user=await User.findById(userId);

           if(!user)
           {
            return res.json({
                success:false,
                message:"User Does Not Exist"
            })
           }

           if(user.verifyOTP=='' || OTPEntered!==user.verifyOTP)
           {
            return res.json({
                success:false,
                message:"Invalid OTP"
            })
           }

            if(Date.now()>user.verifyOTPExpiresAt)
            {
                return res.json({
                    success:false,
                    message:"OTP Window Expired"
                })
            }

            user.isAccountVerified=true;
            user.verifyOTP='';
            user.verifyOTPExpiresAt=0;

            await user.save();

            return res.json({
                success:true,
                message:"Email Verified"
            })



            
        } catch (error) {
            return res.json({
                success:false,
                message:error.message
            })
        }
    
}

async function handleSendOTPForPasswordReset(req,res)
{
    const{email}=req.body;

    if(!email)
    {
        return res.json({
            success:false,
            message:"Missing Credentials"
        })
    }

    try{
    const user=await User.findOne({email});
    if(!user)
    {
        return res.json({
            success:false,
            message:"User Not Exist"
        })
    }

    const OTP=Math.floor(100000+Math.random()*900000);

    user.resetOTP=OTP;
    user.resetOTPExpiresAt=Date.now()+2*60*1000;
    
    await user.save();
    
    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:"Password Reset OTP For Hotel Booking Website",
        text:` ${user.userName} Your OTP for resetting password is ${OTP} it expires in 2 mins`,
        html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",user.resetOTP).replace("{{email}}",email)
    }
    

    await transporter.sendMail(mailOptions);

 return res.json({
    success:true,
    message:"Reset Password OTP sent"
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

async function handleVerificationOfOTPSendForPasswordReset(req,res)
{
    const {otp,email,newPassword}=req.body;
    
    if(!otp ||!email|| !newPassword)
    {
        return res.json({
            success:false,
            message:"Missing Credentials"
        })
    }
    try {

        const user=await User.findOne({email});
        if(!user)
        {
            return res.json({
                success:false,
                message:"User Does Not Exist"
            })
        }

        if(user.resetOTP==''||user.resetOTP!==otp)
        {
            return res.json({
                success:false,
                message:"Enter Valid OTP"
            })
        }
        if(Date.now()>user.resetOTPExpiresAt)
        {
            return res.json({
                success:false,
                message:"OTP Window Expired"
            })
        }
        
        const hashedNewPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedNewPassword;
        user.resetOTP='';
        user.resetOTPExpiresAt=0;

        await user.save();
        
        return res.json({
            success:true,
            message:"Password reset"
        })
        
    } catch (error) {
     
        return res.json({
            success:false,
            message:error.message
        })

        
    }

}

async function isAuthenticated(req,res){
   
    try {

        return res.json({
            success:true
        })
        
    } catch (error) {

        return res.json({
            success:false,
            message:error.message
        })
        
    }
}



module.exports={
   handleRegisterNewUserRequest,
   handleLoginRequest,
   handleLogoutRequest,
   handleSendOTPRequestForVerification,
   handleVerificationOfOTP,
   handleSendOTPForPasswordReset,
   handleVerificationOfOTPSendForPasswordReset,
   isAuthenticated
}