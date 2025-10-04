import react, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import Navbar from '../Components/HotelOwner/Navbar';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
const Login=()=>{

    const [state,setState]=useState('Sign Up');

    {/* three state variables to store the data entered from the input field */}
    const[userName,setUserName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const navigate=useNavigate();

    //to get data from backend
    const{backendURL,setIsLoggedIn,getUserData}=useContext(AppContext); // before use add it to main.jsx file
     


    const onSubmitHandler= async(e)=>{

        try{
           e.preventDefault();

           axios.defaults.withCredentials=true; // to send cookies 

           if(state==='Sign Up')
           {
              const {data}=  await axios.post(backendURL+'/auth/signup',{email,userName,password}); {/* backend api call */}
              
              if(data.success)
              {
                setIsLoggedIn(true);
                await getUserData(); {/* if we will not add this then  we will beed to refresh the code then only useeffect hook will call the get auth state function 
                    which will internally call the getUserData function which gives user data 
                    but this is not ideal as directly after the login the login button should disappear and name logo should appear */}
                navigate('/');
              }
              else
              {
                alert(data.message);
              }

           }
           else
           {
              const {data}=  await axios.post(backendURL+'/auth/login',{email,password}); {/* backend api call */}
              
              if(data.success)
              {
                setIsLoggedIn(true);
                await getUserData(); {/* if we will not add this then  we will beed to refresh the code then only useeffect hook will call the get auth state function 
                    which will internally call the getUserData function which gives user data 
                    but this is not ideal as directly after the login the login button should disappear and name logo should appear */}
                navigate('/');
              }
              else
              {
                alert(data.message);
              }

           }
        }
        catch(error){

        }

    }

    return(
        <div>
        {/* from hotel owner navbar */}
        <Navbar/>
        <div className='flex flex-col items-center justify-center px-6  min-h-screen sm:px-0'>
           <div className='bg-slate-900 flex flex-col items-center justify-center px-6 sm:px-0 p-10 rounded-lg shadow-lg w-full sm:w-96  text-indigo-300'>
           
           <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state==='Sign Up' ?'Register Account':"Login"}</h2>
           <p className='text-center text-sm mb-6'>{state==='Sign Up'?'Register Your Account':'Login to your account'}</p> 

           <form action="" onSubmit={onSubmitHandler}>{/* to ensure that on submission an account is created or if exists user gets logged in to the account */}
                 
                 {state==="Sign Up" && (<div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.userIcon} alt="" />
                    <input onChange={(e)=>setUserName(e.target.value)}  value={userName} type="text" placeholder='Full Name' required className='flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm'/>
                 </div>)} {/* onchange calls the setter function and sets the value of the state variable and to ensure ui is consisitent with the  entered fields the value attribute is used  */}
                  <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.emailIcon} alt="email"/>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' placeholder='Enter your Email Id' required className='flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm'/>
                 </div>
                  <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.lockIcon} alt="" />
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Enter Your Password' required className='flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm'/>
                 </div>

                <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-400 cursor-pointer'>Forgot Password?</p>

                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
           </form>
           
           {state==="Sign Up" ? (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?
              
              <span  onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'> Login Here</span>
             
           </p>):( <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?
              
              <span onClick={()=>setState('Sign Up')}className='text-blue-400 cursor-pointer underline'> Sign Here</span>
             
           </p>
          )}
          
         
         
         </div>
          
        </div>
        </div>
    );
}

export default Login;