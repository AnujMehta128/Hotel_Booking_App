import react, { useContext, useEffect } from 'react';
import Navbar from '../Components/HotelOwner/Navbar';
import React from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const VerifyEmail=()=>{


    axios.defaults.withCredentials=true;
    const {backendURL,isLoggedIn,userData,getUserData}=useContext(AppContext);
    const navigate=useNavigate();
    
    {/* function for backend pe otp bhejna  */}

    const onSubmitHandler=async(e)=>{
        
        
        e.preventDefault();
        const otpArray=inputRefs.current.map(e=>e.value);
        const otp=otpArray.join('');
        
        try {
            
        const{data}=await axios.post(backendURL+'/auth/verify-email-verify-otp',{otp});
        if(data.success)
        {
            alert(data.message);
            getUserData();
            navigate('/')

        }
        else
            {
                alert(data.message);
            }   


        } catch (error) {
            alert(error.message);
        }
    }
    
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


{/* if user is verified he or she should be redirected to homepage if he or she tries to access the email-verify url directly  */}


 useEffect(()=>{
 
   isLoggedIn && userData && userData.isAccountVerified && navigate('/');


 },[isLoggedIn,userData])

    return(
        <div>
            <Navbar/>
            <div className='flex flex-col items-center justify-center px-6  min-h-screen sm:px-0'>
                <div className='flex flex-col items-center justify-center px-6 sm:px-0'>
                   <form  onSubmit={onSubmitHandler}action="" className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>
                            Email verify OTP
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
                    <button className='w-full py-3  bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full '>Verify Email</button>
                   </form>
                </div>
                
            </div>
        </div>
    );
}

export default VerifyEmail