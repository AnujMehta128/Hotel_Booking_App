import react, { useContext, useState } from 'react';
import Navbar from '../Components/HotelOwner/Navbar';
import { assets } from '../assets/assets';
import React from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword=()=>{
      
    const navigate=useNavigate();

    const {backendURL}=useContext(AppContext);

    axios.defaults.withCredentials=true;


   const [email,setEmail]=useState("");
   const [newPassword,setNewPassword]=useState("");

 {/* state variables to set which form should be displayed */}

      const [isEmailEntered,setIsEmailEntered]=useState(''); {/* email entered */}
      const [otp,setOtp]=useState(0);
      const [isOTPSubmitted,setIsOTPSubmitted]=useState(false);

    
       const inputRefs=React.useRef([]);
   
       
       {/* to shift focus automatically when the user fills one text otp  */}
       const handleInput=(e,index)=>{
             if(e.target.value.length>0 && index<inputRefs.current.length-1)
             {
               inputRefs.current[index+1].focus();
             }
       }
   
       {/* backspace functionality */}
   
       const handleBackspace=(e,index)=>{
           if(e.key==='Backspace' && e.target.value==='' && index>0)
           {
               inputRefs.current[index-1].focus();
           }
       }
   
       {/* handle paste functionaluty */}
   
       const handlePaste=(e)=>{
          //  e.preventDefault();
           const paste=e.clipboardData.getData('text');
           const pasteArray=paste.split('');
           pasteArray.forEach((char,index)=>{
   
               if(inputRefs.current[index])
               {
                   inputRefs.current[index].value=char;
               }
   
           })
   
   
       }



       const onSubmitEmail= async (e)=>{
        e.preventDefault();
        try {
            const {data}=await axios.post(backendURL+'/auth/send-password-reset-otp',{email});

            data.success ? alert(data.message): alert(data.message);
            data.success && setIsEmailEntered(true);


        } catch (error) {
            alert(error.message)
        }
       }

       const onSubmitOTP=(e)=>{
        e.preventDefault();
        try {
            
            const otpArray=inputRefs.current.map((e)=>e.value);
            const otp=otpArray.join('');
            setOtp(otp);
            setIsOTPSubmitted(true);


        } catch (error) {
            
        }
       }

      const onSubmitNewPassword=async(e)=>{
        e.preventDefault();
        try {
          
            const {data}= await axios.post(backendURL+'/auth/verify-otp-send-for-password-reset',{email,otp,newPassword});

            data.success?alert(data.message):alert(data.message);
            data.success && navigate('/login');

            
        } catch (error) {
            alert(error.message);
        }
      }

    return(
        <div>
               <Navbar/>

               <div className='flex flex-col items-center justify-center min-h-screen'>
                <div className='flex flex-col items-center justify-center'>

                   
               {!isEmailEntered &&    
                   <form onSubmit={onSubmitEmail}className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>
                            Reset Password
                    </h1>

                    <p className='text-center mb-6 text-indigo-300'>
                             Enter your registered email id.
                    </p>  

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.emailIcon} alt="" className='w-3 h-3'/>
                        <input type="email"  placeholder='Email Id' className='w-full text-white outline-none bg-transparent'
                         value={email} onChange={(e)=>setEmail(e.target.value)}
                         required/>
                    </div>

                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 '>
                        Submit
                    </button>

                   </form>
}
  
   {/* otp input form for reset password otp */}
 {/* copied from the verify email otp form */}
  
  {!isOTPSubmitted && isEmailEntered &&
                  
                  <form onSubmit={onSubmitOTP} action="" className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>
                           Reset password OTP
                    </h1>
                    <p className='text-center mb-6 text-indigo-300'>
                             Enter the 6-digit code sent on your registered email id.
                    </p>                           
                     <div className='flex justify-between mb-8' onPaste={handlePaste}>

                        {Array(6).fill(0).map((_,index)=>(
                            <input type="text" maxLength='1' key={index} required 
                            className='w-12 h-12 bg-[#333A5C] white text-white text-center text-xl rounded-md'
                            ref={e=>inputRefs.current[index]=e}
                             onInput={(e)=>handleInput(e,index)}
                             onKeyDown={(e)=>handleBackspace(e,index)}
                             /> 
                        ))}

                    </div>
                    <button className='w-full py-2.5  bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full '>Verify Email</button>
                   </form>

                    }
                   {/* form to enter new password*/}


      {isOTPSubmitted && isEmailEntered &&              

                    <form action="" onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>
                            New password
                    </h1>

                    <p className='text-center mb-6 text-indigo-300'>
                             Enter your new password below.
                    </p>  

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lockIcon} alt="" className='w-3 h-3'/>
                        <input type="password"  placeholder='New password' className='w-full text-white outline-none bg-transparent'
                         value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}
                         required/>
                    </div>

                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 '>
                        Submit
                    </button>

                   </form>

      }

                </div>
               </div>
        </div>
    );
}

export default ResetPassword