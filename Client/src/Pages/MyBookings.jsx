import react, { useContext, useEffect, useState } from'react'
import Title from '../Components/Title'
import { assets, userBookingsDummyData } from '../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyBookings=()=>{

    const {userData,backendURL}=useContext(AppContext);

    const [bookings,setBookings]=useState([]);


     const fetchUserBookings=async()=>{
        try {
            axios.defaults.withCredentials=true;
            const {data}=await axios.get(backendURL+'/booking/user');
            if(data.success)
            {
                setBookings(data.bookings);
            }
            else
            {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
     }

     useEffect(()=>{
        if(userData)
        {
            fetchUserBookings();
        }
     },[userData])

    return(

        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            
            <Title title='My Bookings' subtitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left'/>
        


           
           <div className='max-w-6xl mt-8 w-full text-gray-800'>
            
            <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                <div className='w-1/3'>Hotels</div>
                <div className='w-1/3'>Date & Timings</div>
                <div className='w-1/3'>Payment</div>
            </div>

                {bookings.map((booking) => (

                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                        {/* Hotel Details*/}
                        <div className='flex flex-col md:flex-row'>
                           <img src={booking.room.images[0]} alt="" className='min-md:w-44 rounded shadow object-cover'/>
                            
                            <div className='flex flex-col gap-1.5 max-md: mt-3 min-md:ml-4'>
                                <p className='font-playair text-2xl'>{booking.hotel.hotelName}
                                <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                                </p>

                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.locationIcon} alt="" />
                                    <span>{booking.hotel.hotelAddress}</span>
                                </div>
                                    
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    
                                    <img src={assets.guestsIcon} alt="" />
                                    <span >Guests:{booking.guests}</span>

                                </div>  


                                <div>
                                  <p className='text-base'>Total: ${booking.totalPrice}</p>    
                                </div>  
                            
                            </div>
                        
                        
                        
                        </div>
                        {/* check-in check-out date */}
                        <div className='flex flex-row items-center md:gap-12 mt-3 gap-8'>
                            
                            <div>
                              <p>Check In Date:</p>
                               <p className='text-gray-500 text-sm'>{new Date(booking.checkInDate).toDateString()}</p>

                            </div>

                            <div>
                                <p>Check Out Date:</p>
                                <p className='text-gray-500 text-sm'>{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                             

                        </div>

                        {/* paid or unpaid */}
                        <div className='flex flex-col items-start justify-center pt-3'>
                             
                             <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.isPaymentDone ? "bg-green-500": "bg-red-500"}`}></div>
                                <p className={` text-sm ${booking.isPaymentDone ? "text-green-500": "text-red-500"}`}>
                                    {booking.isPaymentDone ? "Paid":"Unpaid"}
                                </p>
                             </div>

                             <div>
                                {!booking.isPaymentDone && <button className='border rounded-full border-gray-400 hover:bg-gray-50 transition-all cursor-pointer px-4 py-1.5 '>
                                    
                                    Pay Now
                                    </button>}
                             </div>
                        </div>
                    </div>

             ))}
           </div>
        </div>


       


    );
}

export default MyBookings;