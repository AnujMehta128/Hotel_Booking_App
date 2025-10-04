import react, { useContext, useEffect, useState } from 'react'
import Title from '../../Components/Title';
import { assets, dashboardDummyData } from '../../assets/assets';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard =()=>{



      const {currency,userData,backendURL}=useContext(AppContext);

     const [dashboardData,setDashBoardData]=useState({
        bookings:[],
        totalBookings:0,
        totalRevenue:0
     });

     {/* states to fetch all the hotels of the owner */}
     const [ownerHotels,setOwnerHotels]=useState([]);
     const [selectedHotel,setSelectedHotel]=useState("");

     const fetchHotels=async()=>{
        try {
             axios.defaults.withCredentials=true;
             const {data}=await axios.get(backendURL+'/hotel/owner-hotels');
             if(data.success)
             {
               setOwnerHotels(data.hotels);
               if(data.hotels.length>0)
               {
                setSelectedHotel(data.hotels[0]._id);
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


     const fetchDashboardData=async(hotelId)=>{
        try {
            axios.defaults.withCredentials=true;
            const {data}=await axios.get(backendURL+`/booking/${hotelId}/owner`);
            if(data.success)
            {
                setDashBoardData(data.dashboardData);
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
            fetchDashboardData(selectedHotel);
        }
     },[selectedHotel])


    return(
        <div>
           <Title align='left' font='outfit' title='Dashboard' subtitle='Monitor your room listings,track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations'/>
             
             
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
             
              <div className='flex gap-4 my-8'>
                {/* Total Bookings */}

                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                      <img src={assets.totalBookingIcon} alt=""  className='max-sm:hidden h-10'/>
                      <div className='flex flex-col sm:ml-4 font-medium'>
                         <p className='text-blue-500 text-lg'>Total Bookings</p>
                          <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                      </div>
                </div>

                {/* Total Revenue */}

                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8 '>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm: ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenue</p>
                        <p className='text-neutral-400 text-base'>${dashboardData.totalRevenue}</p>
                    </div>
                </div>

             </div>



             {/* Total Bookings */}

            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>

                <table className='w-full'>
                    <thead className='bg-gray-50'>
                         <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Payment Status</th>
                         </tr>
                    </thead>

                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item,index)=>(
                           <tr key={index}>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                {item.userId.userName}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                {item.room.roomType}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                ${item.totalPrice}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 flex'>
                                <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid?"bg-green-200 text-green-600":"bg-amber-200 text-yellow-600"}`}>
                                    {item.isPaid? 'Completed':'Pending'}
                                </button>
                            </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
                

            </div>

        </div>
    );
}

export default Dashboard;