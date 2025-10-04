{/* code same as featured destination */}

import react, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const RecommendedHotels=()=>
{
     const navigate=useNavigate()
         const {rooms,searchedCities}=useContext(AppContext);

         const[recommended,setRecommended]=useState([]);

         const filterHotels=()=>{
            const filteredHotels=rooms.slice().filter(room=>searchedCities.includes(room.hotel.hotelCity)); {/* for safety slice is used fi not used the result will be same as filter does not makes 
                changes to original array but returns a new array */}
            setRecommended(filteredHotels);      
        }

        useEffect(()=>{
            filterHotels();
        },[rooms,searchedCities])
    
        return recommended.length>0 &&  (
           <div className='flex flex-col items-center px-6 md:px-24 bg-slate-50 py-20'>
    
              <Title title='Recommended Hotels' subtitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'>
    
              </Title>
            
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
               {rooms.slice(0,4).map((room,index)=>
            
            (<HotelCard key={room._id} room={room} index={index}>
    
            </HotelCard>)
            )}
            </div>
    
            <button onClick={()=>{navigate('/rooms');scrollTo(0,0)}}
            className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>View All Destinations</button>
           </div>
        );
}

export default RecommendedHotels;