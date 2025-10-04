import react, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const HotelRegistration=()=>{
    
    const [isStandalone,setIsStandlone]=useState(false);
    const {setShowHotelRegistration,backendURL,setIsOwner}=useContext(AppContext);


    {/* states to store  the form data  */}

    const [hotelName,setHotelName]=useState("");
    const [hotelAddress,setHotelAddress]=useState("");
    const [hotelContact,setHotelContact]=useState("");
    const [hotelCity,setHotelCity]=useState("");
    const [houseNumber,setHouseNumber]=useState("");
    const [street,setStreet]=useState("");
    const [locality,setLocality]=useState("");
    const [pincode,setPincode]=useState("");
    const[buildingName,setBuildingName]=useState("");

    const onSubmitHandler=async(e)=>{
      e.preventDefault();
      try {
         
          axios.defaults.withCredentials=true;

         const {data}=await axios.post(backendURL+'/hotel/register-hotel',{
            hotelName,
            hotelAddress,
            hotelContact,
            hotelCity,
            houseNumber,
            street,
            locality,
            pincode,
            isStandalone,
            buildingName
         })

         if(data.success)
         {
            toast.success(data.message);
            setIsOwner(true);
            setShowHotelRegistration(false);
         }
         else
         {
            toast.error(data.message);
         }
         
      } catch (error) {

         toast.error(error.message);
         
      }
    }


    return(
        
        <div onClick={()=>setShowHotelRegistration(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70 '>
            
            
            {/* stop propogation ensures clicking on input fields not closes the form */}
            <form   onClick={(e) => e.stopPropagation()}  onSubmit={onSubmitHandler}   className='flex bg-white rounded-xl max-w-4xl max-md:mx-2 max-h-[90vh] overflow-y-scroll'>
                <img src={assets.regImage} alt="" className='w-1/2 object-cover rounded-xl hidden md:block' />

              <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                <img src={assets.closeIcon} alt="" className='absolute top-4 right-4 h-4 w-4 cursor-pointer ' 
                onClick={()=>setShowHotelRegistration(false)} />
                <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>
              
              
                 {/* Hotel Name */}

                 <div className='w-full mt-4'>
                    <label htmlFor="hotelName" className='font-medium text-gray-500'>
                       Hotel Name  
                    </label>

                    <input id='hotelName' onChange={(e)=>setHotelName(e.target.value)} value={hotelName}type="text" placeholder='Type Here' name='hotelName' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>

                 {/* Hotel Address */}

                 <div className='w-full mt-4'>
                    <label htmlFor="hotelAddress" className='font-medium text-gray-500'>
                       Hotel Address  
                    </label>

                    <input id='hotelAddress' onChange={(e)=>setHotelAddress(e.target.value)} value={hotelAddress} type="text" placeholder='Type Here' name='hotelAddress' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>

                 {/* Hotel Contact */}
                 <div className='w-full mt-4'>
                    <label htmlFor="hotelContact" className='font-medium text-gray-500'>
                       Hotel Contact 
                    </label>

                    <input id='hotelContact' onChange={(e)=>setHotelContact(e.target.value)} value={hotelContact}  type="text" placeholder='Type Here' name='hotelContact' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>


                 {/* Hotel City */}

                    <div className='w-full mt-4'>
                    <label htmlFor="hotelCity" className='font-medium text-gray-500'>
                       Hotel City
                    </label>

                    <input id='hotelCity'  onChange={(e)=>setHotelCity(e.target.value)} value={hotelCity} type="text" placeholder='Type Here' name='hotelCity' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>

                 {/* House Number  */}

                 
                    <div className='w-full mt-4'>
                    <label htmlFor="houseNumber" className='font-medium text-gray-500'>
                       House Number
                    </label>

                    <input id='houseNumber' onChange={(e)=>setHouseNumber(e.target.value)} value={houseNumber} type="text" placeholder='Type Here' name='houseNumber' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>


                 {/* Street */}

                 <div className='w-full mt-4'>
                    <label htmlFor="street" className='font-medium text-gray-500'>
                       Street
                    </label>

                    <input id='street' onChange={(e)=>setStreet(e.target.value)} value={street}  type="text" placeholder='Type Here' name='street' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>

                 {/* Locality */}

                   <div className='w-full mt-4'>
                    <label htmlFor="locality" className='font-medium text-gray-500'>
                       Locality
                    </label>

                    <input id='locality' onChange={(e)=>setLocality(e.target.value)} value={locality}  type="text" placeholder='Type Here' name='locality' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>

                 {/* Pincode */}

                  <div className='w-full mt-4'>
                    <label htmlFor="pincode" className='font-medium text-gray-500'>
                       Pincode
                    </label>

                    <input id='pincode'  onChange={(e)=>setPincode(e.target.value)} value={pincode} type="text" placeholder='Type Here' name='pincode' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  required/>

                 </div>

                 {/* Is Standalone */}
                      <div className='w-full mt-4 flex items-center'>
                    <label htmlFor="isStandalone" className='font-medium text-gray-500'>
                       Is Standalone
                    </label>

                    <input id='isStandalone'type="checkbox" name='isStandalone' checked={isStandalone} className='h-5 w-5 ml-3 text-indigo-600  border-gray-300 rounded' onChange={()=>setIsStandlone(!isStandalone)} />

                 </div>

                  {!isStandalone &&
                  <div className='w-full mt-4'>
                    <label htmlFor="buildingName" className='font-medium text-gray-500'>
                       Building Name
                    </label>

                    <input id='buildingName'  onChange={(e)=>setBuildingName(e.target.value)} value={buildingName} type="text" name='buildingName' className= ' border border-gray-300 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'  placeholder='Type Here' required/>

                 </div>
                 }

                 <button className='bg-primary px-5 py-5 mt-3 mb-5 rounded-2xl text-gray-50' type='submit'>Register Now</button>
              
              </div>
             


            </form>
                
        </div> 













    );
}

export default HotelRegistration