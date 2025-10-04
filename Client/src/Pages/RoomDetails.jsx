import react, { useContext, useEffect, useState } from'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets';
import StarRating from '../Components/StarRating';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const RoomDetails=()=>{
        
      const navigate=useNavigate();
      const{id}=useParams();
      const {rooms,userData,backendURL}=useContext(AppContext);
      
      const [room,setRoom]=useState(null);
      const [mainImage,setMainImage]=useState(null);
      
      const [checkInDate,setCheckInDate]=useState(null);
      const [checkOutDate,setCheckOutDate]=useState(null);
      const [guests,setGuests]=useState(1);

      const [isAvailabel,setIsAvailabel]=useState(false);


      {/* check if the room is availabel */}

      const checkAvailability=async()=>{
        try {

            if(checkInDate >=checkOutDate)
            {
                toast.error("Check In Date should be smaller than Check Out data")
            }

            const {data}=await axios.post(backendURL+'/booking/check-availability',{roomId:id,checkInDate,checkOutDate});
            if(data.success)
            {
                if(data.isAvailabel){
                    setIsAvailabel(true);
                    toast.success('Room Is Availabel');
                }
                else
                {
                    setIsAvailabel(false);
                    toast.error('Room Is not availabel');
                }
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {

            toast.error(error.message);
            
        }

      }

      {/* on submit handler to check availability and book the room */}

       const onSubmitHandler=async(e)=>{
        e.preventDefault();
        try {
            if(!isAvailabel)
            {
                return checkAvailability();
            }
            else
            {
                axios.defaults.withCredentials=true;
                const {data}=await axios.post(backendURL+'/booking/book',{roomId:id,checkInDate,checkOutDate,guests,paymentMethod:"Pay At Hotel"});
                 if(data.success)
                 {
                    toast.success(data.message)
                    navigate('/mybookings')
                    scrollTo(0,0); 
                 }
                 else
                 {
                    toast.error(data.message);
                 }
            }
        } catch (error) {
            toast.error(error.message);
            
        }
       }


      




      useEffect(()=>{
        const room=rooms.find((room)=>room._id===id)
         
        room && setRoom(room)
        room && setMainImage(room.images[0]);

      },[rooms])

    return room &&(
        <div className='py-25 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
         

          <div className='flex  flex-col md:flex-row items-start md:items-center gap-2'>
            <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.hotelName} <span className='font-inter text-sm'>{room.roomType}</span></h1>
            <p className='text-sx font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
          </div>

           <div className='flex items-center gap-1 mt-2'>
            <StarRating/>
            <p>200+ Reviews</p>
           </div>


            <div className='flex items-center gap-1 mt-2 text-gray-500'>
                <img src={assets.locationIcon} alt="" />
                <span>{room.hotel.hotelAddress}</span>
            </div>

            <div className='flex flex-col md:flex-row mt-6 gap-6 '>
                
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="" className='w-full rounded-xl shadow-lg object-cover' />
                </div>

               <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                 {room?.images.length>1 && room.images.map((image,index)=>(
                    <img key={index}src={image} alt="" onClick={()=>setMainImage(image)} className={`w-full rounded-xl object-cover shadow-md cursor-pointer ${mainImage===image && 'outline-3 outline-orange-500'}`}/>
                 ))}
               </div>

            </div>


        <div className='flex flex-col md:flex-row justify-between mt-10'>
              
              <div>              
              <h1 className='text-3xl md:text:4xl font-playfair'>
                Experience Luxury Like Never Before
              </h1>

                <div className='flex gap-4 flex-wrap items-center mt-3 mb-6 '>
                {room.amenities.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 '>
                        <img src={facilityIcons[item]} alt="" className='w-5 h-5' />
                        <p className='text-xs'>{item}</p>
                    </div>
                    ))}
                </div>
                </div>


              <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>

            </div>


            <div>

                <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                    <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                         
                        <div className='flex flex-col'>
                            <label htmlFor="checkInDate" className='font-medium'>Check In Date</label>
                            <input  onChange={(e)=>setCheckInDate(e.target.value)} min={new Date().toISOString().split('T')[0]} type="date"  id='checkInDate' placeholder='Check In Date' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'required/>
                        </div>

                     <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                        <div className='flex flex-col'>
                            <label htmlFor="checkOutDate" className='font-medium'> Check Out Date</label>
                            <input onChange={(e)=>setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate} type="date"  id='checkOutDate' placeholder='Check Out Date' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'required/>
                        </div>
                       
                          <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                         <div className='flex flex-col'>
                            <label htmlFor="guests" className='font-medium'>Guests</label>
                            <input onChange={(e)=>setGuests(e.target.value)} value={guests} type="number"  id='guests' placeholder='1' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'required/>
                        </div>

                    </div>
                    
                    <button className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md: mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
                    
                   { isAvailabel? "Book Now" : "Check Availability"}
                    
                    </button>
                </form>

            </div>


            <div className='mt-25 space-y-4'>
                {roomCommonData.map((specification,index)=>(
                    <div key={index} className='flex items-start gap-2'>

                      <img src={specification.icon} alt="" className='w-6.5' />

                      <div>
                      <p className='text-base'>{specification.title}</p>
                      <p className='text-gray-500'>{specification.description}</p>
                      </div>

                    </div>
                ))}

            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-15 text-gray-500'>
                <p>
                    Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.
                </p>
            </div>


            <div className='flex flex-col items-start gap-4'>

                <div className='flex gap-4'>

                    <img src={room.hotel.hotelOwner.image} alt=""  className='h-14 w-14 md:h-18 md:w-18 rounded-full'/>
                     
                    <div>
                      <p className='text-lg md:text-xl'>Hosted By {room.hotel.hotelName}</p>
                      <div className='flex items-center mt-1'>
                       <StarRating></StarRating>
                       <p className='ml-2'>200+ Reviews</p>
                      </div>
                    </div>

                </div>

                <button className='bg-primary hover:bg-primary-dull transition-all cursor-pointer px-6 py-2.5 rounded mt-4 text-white'>
                    Contact Now
                </button>
                 
            </div>

         

        </div>
    );
}

export default RoomDetails