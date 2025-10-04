import React from 'react';
import Navbar from './Components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import AllRooms from './Pages/AllRooms';
import RoomDetails from './Pages/RoomDetails';
import MyBookings from './Pages/MyBookings';
import HotelRegistration from './Components/HotelRegistration';
import Layout from './Pages/HotelOwner/Layout';
import Dashboard from './Pages/HotelOwner/Dashboard';
import Addroom from './Pages/HotelOwner/Addroom';
import Listroom from './Pages/HotelOwner/Listroom';
import Login from './Pages/Login';
import VerifyEmail from './Pages/VeriyfEmail';
import ResetPassword from './Pages/ResetPassword';
import {Toaster} from 'react-hot-toast';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const App=()=>{

   const isOwnerPath=useLocation().pathname.includes("owner");
   
   const isLoginPath=useLocation().pathname.includes("login");
   const isVerifyEmailPath=useLocation().pathname.includes("email-verify")
   const isResetPasswordPath=useLocation().pathname.includes("reset-password");

   {/* hotel reg state to be accessed through the context file */}

   const {showHotelRegistration}=useContext(AppContext);


  return(
    <div>
      <Toaster/>
       { (!isOwnerPath && !isLoginPath && !isVerifyEmailPath && ! isResetPasswordPath) && <Navbar></Navbar>}
       

      {showHotelRegistration && <HotelRegistration></HotelRegistration>} 

       <div className='min-h-[70vh]'>

      <Routes>
        <Route path='/' element={<Home/>}></Route>
         <Route path='/rooms' element={<AllRooms/>}></Route>
        <Route path='/rooms/:id' element={<RoomDetails/>}></Route>
        <Route path='/mybookings' element={<MyBookings/>}></Route>
        <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="add-room"  element={<Addroom/>}/>
            <Route path="list-room" element={<Listroom/>}/>
        </Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/email-verify' element={<VerifyEmail></VerifyEmail>}></Route>
        <Route path='/reset-password' element={<ResetPassword/>}></Route>
      </Routes>

       </div>
    
    <Footer/>

    </div>
  );
}

export default App