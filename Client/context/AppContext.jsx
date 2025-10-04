import  axios  from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'

export const AppContext=createContext();


export const AppContextProvider=(props)=>{
        
       axios.defaults.withCredentials=true;

        const backendURL=import.meta.env.VITE_BACKEND_URL;
        const currency=import.meta.env.VITE_CURRENCY|| "$";    
        const navigate=useNavigate(); 

        const[isLoggedIn,setIsLoggedIn]=useState(false);
        const[userData,setUserData]=useState(false);
        const[isOwner,setIsOwner]=useState(false);
        const[showHotelRegistration,setShowHotelRegistration]=useState(false);
        const[searchedCities,setSearchedCities]=useState([]);
        
        {/* room data for featured destination  */}
       const[rooms,setRooms]=useState([]);

      const fetchRooms=async ()=>{
         try {
            const {data}=await axios.get(backendURL+'/room/');
            if(data.success)
            {
               setRooms(data.rooms);
            }
            else
            {
               toast.error(data.message);
            }
         } catch (error) {
            toast.error(error.message);
         }
      }

        
        {/* to check authentication status */}
        const getAuthState=async()=>{

        try{
          const{data}= await axios.get(backendURL+'/auth/is-auth');
        //  console.log("Auth check:", data);
          if(data.success)
          {
             setIsLoggedIn(true);
             getUserData();

          }
        }
        catch(error){
               alert(error.message)
        }
    }


    {/*  to get user data we write a function */}

    const getUserData= async()=>{

         try {
             
            const {data}=await axios.get(backendURL+'/user/get-user');
             if(data.success)
               {
                  setUserData(data.userData);
                  setIsOwner(data.userData.role==="hotelOwner");
                  setSearchedCities(data.userData.recentSearchCities);
               }
               else
               {
                   {/* retry to fetch data again after 5 seconds */}
                   setTimeout(()=>{
                     getUserData();
                   },5000)
               }
         } catch (error) {
            toast.error(error.message);
         }

    }

        
    
    {/* to run is getauthstate function whenever the web page gets loaded we use useeffect  hook*/}

     useEffect(()=>{
        getAuthState();
     },[])
    
     useEffect(()=>{
      fetchRooms();
     },[])
    
    
    
    const value={
             backendURL,
             isLoggedIn,
             setIsLoggedIn,
             userData,
             setUserData,
             getUserData,
             navigate,
             setIsOwner,
             isOwner,
             axios,
             showHotelRegistration,
             setShowHotelRegistration,
             searchedCities,
             setSearchedCities,
             rooms,
             setRooms


        }/* we can access these values or function in any component */

    return(
        <AppContext.Provider value={value}>
              {props.children}
        </AppContext.Provider>
    );
}