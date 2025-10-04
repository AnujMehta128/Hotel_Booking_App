import react, { useContext, useEffect, useState } from 'react'
import Title from '../../Components/Title';
import { assets } from '../../assets/assets';
import { AppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Addroom=()=>{


    {/* to fetch data */}

    const {userData,backendURL}=useContext(AppContext);

     // state for hotel list

     const [ownerHotels,setOwnerHotels]=useState([]);
     const [selectedHotel,setSelectedHotel]=useState("");


     const[images,setImages]=useState({
        1:null,
        2:null,
        3:null,
        4:null
     })

     const [inputs,setInputs]=useState({
        roomType:'',
        pricePerNight:'',
        amenities:{
            'Free WiFi':false,
            'Free Breakfast':false,
            'Room Service':false,
            'Mountain View':false,
            'Pool Access':false
        }
     })

     {/* loading state */}
     const[loadingState,setLoadingState]=useState(false);


     {/* fetching hotels for logged in user  */}

     useEffect(()=>{
        async function fetchHotels() {

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

            } catch (error) {
                toast.error(error.message);
            }
            
        }
        fetchHotels();
     },[])

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        if (!inputs.amenities || !inputs.pricePerNight || !inputs.roomType || !Object.values(images).some(image => image)) {
            toast.error("Please fill all the fields");
            return;
        }
        setLoadingState(true);

        try {

            const formData = new FormData();
            formData.append('roomType', inputs.roomType);
            formData.append('pricePerNight', inputs.pricePerNight);
            {/* converting amenities object to array and keeping only enabled amenities  ans inputs.amenities[key] is either true or false */ }

            const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
            formData.append('amenities', JSON.stringify(amenities));


            {/* adding images to form data */ }

            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendURL + `/room/${selectedHotel}/register-new-room`, formData);

            if (data.success) {
                toast.success(data.message);
                setInputs({
                    roomType: '',
                    pricePerNight: '',
                    amenities: {
                        'Free Wifi': false,
                        'Free Breakfast': false,
                        'Room Service': false,
                        'Mountain View': false,
                        'Pool Access': false
                    }

                })
                setImages({
                    1: null,
                    2: null,
                    3: null,
                    4: null
                })

            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        finally{
            setLoadingState(false);
        }
    }


    return(
        <form action="" onSubmit={onSubmitHandler}>
            <Title align='left' font='outfit' title='Add Room' subtitle='Fill in the details carefully and accurate room details,pricing and amenities to enhance the user booking experience'></Title>
            
            
            
            {/* Hotel Selection */}
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
            {/* Upload Area For Images */}
            <p className='text-gray-800 mt-4'>Images</p>
            <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                {Object.keys(images).map((key)=>(
                    <label htmlFor={`roomImage${key}`}key={key}>
                         <img src={images[key]?URL.createObjectURL(images[key]):assets.uploadArea} alt=""  className='max-h-13 cursor-pointer opacity-80'/>
                         <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={e=>setImages({...images,[key]: e.target.files[0]})}/>
                    </label>
                ))}
            </div>


            {/* Room Type and Price Selection */}
             
             <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
                <div className='flex-1 max-w-48'>
                    <p className='text-gray-800 mt-4'>Room Type</p>
                    <select className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' value={inputs.roomType} onChange={e=>setInputs({...inputs,roomType:e.target.value})}>
                        <option value="">Select Room Type</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Luxury Room">Luxury Room</option>
                        <option value="Family Suite">Family Suite</option>
                    </select>
                </div>

                <div>
                    <p className='mt-4 text-gray-800'> Price <span className='text-xs'>/night</span>
                    </p>
                    <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.pricePerNight} onChange={e=>setInputs(({...inputs,pricePerNight:e.target.value}))} />

                </div>
             </div>

             <p className='text-gray-800 mt-4'>Amenities</p>
              <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
                   {Object.keys(inputs.amenities).map((amenity,index)=>(
                    <div key={index}>
                        <input type="checkbox" id={`amenities${index+1}`} checked={inputs.amenities[amenity]} onChange={()=>setInputs({...inputs,amenities:{...inputs.amenities,[amenity]:!inputs.amenities[amenity]}})}/>
                        <label htmlFor={`amenities${index+1}`}> {amenity}</label>
                    </div>
                   ))}
               </div>

               <button className='bg-primary text-white px-8 py-2 rounded mt-4 mb-4 cursor-pointer' disabled={loadingState}>
               {loadingState ? 'Adding...' : 'Add Room'}
               </button>
        </form>
    );
}

export default Addroom;