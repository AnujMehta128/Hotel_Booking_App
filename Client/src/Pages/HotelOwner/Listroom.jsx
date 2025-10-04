import react, { useContext, useEffect, useState } from 'react';
import { roomsDummyData } from '../../assets/assets';
import Title from '../../Components/Title';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Listroom=()=>{
    
      const [rooms,setRooms]=useState([]);
      const {userData,backendURL}=useContext(AppContext);

      {/* states for fetching the owner hotels */}
    const [ownerHotels,setOwnerHotels]=useState([]);
    const [selectedHotel,setSelectedHotel]=useState("");

      
      // fetch hotels of the owner
      
      const fetchHotels=async ()=>{
        try {
            
          axios.defaults.withCredentials=true;
          const{data}=await axios.get(backendURL+'/hotel/owner-hotels');
          if(data.success)
          {
            setOwnerHotels(data.hotels);
            if(data.hotels.length>0)
            {
                setSelectedHotel(data.hotels[0]._id)
            }
          }
          else
          {
            toast.error(data.message);
          }


        } catch (error) {

            toast.error(error.message);
            
        }
      }
      
      
      
      
      // fetch rooms of the hotel owner

      const fetchRooms=async (hotelId)=>
      {
        if(!hotelId)
        {
            return;
        }
        try {
              axios.defaults.withCredentials=true;
            const {data}=await axios.get(backendURL+`/room/${hotelId}/all-owner-rooms`)
             if(data.success)
             {
                setRooms(data.rooms);
             }
             else
             {
                toast.error(data.message);
             }
        
        
        }
        catch (error) {
          toast.error(error.message);   
        }
      }



         {/* function to toggle availability of room */}

         const toggleAvailabilty=async(roomId)=>{

            try {
                axios.defaults.withCredentials=true;
                const {data}=await axios.post(backendURL+`/room/update-room-availability`,{roomId});
                if(data.success)
                {
                    toast.success(data.message);
                    fetchRooms(selectedHotel);
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
           fetchHotels();
        }
      },[userData])

      useEffect(()=>{
         
         if(selectedHotel)
         {
            fetchRooms(selectedHotel);
         }

      },[selectedHotel])




      

    return(
        <div>
             <Title align='left' font='outfit' title='Room listings' subtitle='View,edit or manage all listed rooms. Keep the information up to date to provide the best experience for users' ></Title>
             
             
            {/* Hotel Selection Dropdown */}
            <p className="text-gray-800 mt-4">Select Hotel</p>
            <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="border border-gray-300 mt-1 rounded p-2 w-64"
            >
                {ownerHotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                        {hotel.hotelName}
                    </option>
                ))}
            </select>
             <p className='text-gray-500 mt-8'>All Rooms</p>

             {/* Dashboard Table */}
           <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>

                <table className='w-full'>
                    <thead className='bg-gray-50'>
                         <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Price/night</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                         </tr>
                    </thead>
                      
                      <tbody className='text-sm'>
                            {rooms.map((item,index)=>(
                                <tr key={index}>
                                     <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item.roomType}
                                     </td>
                                     <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {item.amenities.join(' , ')}
                                     </td>
                                     <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        $ {item.pricePerNight}
                                     </td>
                                     <td className='py-3 px-4 text-red-500 border-t border-gray-300 text-sm text-center'>
                                        <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                            <input type="checkbox" className='sr-only peer' checked={item.isAvailable}  onChange={()=>toggleAvailabilty(item._id)}/>
                                            <div className='w-12 h-7 bg-slate-300 rounded-full peer
                                             peer-checked:bg-blue-600 transition-colors duration-200'>
                                                <span className='dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>
                                            </div>
                                        </label>
                                     </td>
                                </tr>
                            ))}
                      </tbody>

                    </table>
                    </div>

        </div>
    );
}

export default Listroom;