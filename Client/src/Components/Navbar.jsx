import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/room' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];
         
    const navigate=useNavigate(); // for navigation to login page on click

{/* getting user data from app context */}

const {userData,backendURL,setUserData,setIsLoggedIn ,isOwner,setShowHotelRegistration}=useContext(AppContext);
 

            {/* verify Email functionality */}

            const sendVerificationOTP=async ()=>{
                try {
                    
                   axios.defaults.withCredentials=true;

                   const {data}=await axios.post(backendURL+'/auth/verify-email-send-otp');

                   if(data.success){
                    navigate('/email-verify');
                    alert(data.message);

                   }
                   else
                   {
                    alert(data.message);
                   }


                } catch (error) {
                    alert(error.message);
                }
            }

          {/* Logut functionality */}

            const Logout = async()=>{
                try 
                {
                 
                    {/* to send credentials with req */}
                    axios.defaults.withCredentials=true;
                    const {data}=await axios.post(backendURL+'/auth/logout');

                    data.success && setIsLoggedIn(false);
                    data.success && setUserData(false);
                    navigate('/');


                } catch (error) {

                    alert(error.message);
                    
                }
            }
       

     
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {

        if(location.pathname!=='/')
            {
                setIsScrolled(true);
                return;
            }
           else
            {
                    setIsScrolled(false);
            }
                setIsScrolled(prev=>location.pathname!=='/'? true:prev); 

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (
       
           
            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

                {/* Logo */}
                <Link to='/'>
                    <img src= { assets.logo } alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}

                    {/* is user data is availabel only then dashboard button appears if user data is there but user is not hthe owner list your hotel button appears 
                    else dashboard button appears */}

                    {userData &&
                    <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`} onClick={()=> isOwner ? navigate('/owner'):setShowHotelRegistration(true)}>
                        {isOwner ? 'Dashboard' :'List your hotel'} 
                    </button>
                    }

                    {userData &&
                    <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`} onClick={()=>setShowHotelRegistration(true)}>
                        List your hotel 
                    </button>
                    }
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                    <img src={assets.searchIcon} alt="search" className={`${isScrolled && 'invert'} h-7 transition-all duration-500` }/>

                    {/* if user data is availabel it means user is authenticated and logged in */}
                    {userData? 
                    <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
                    {userData.userName[0].toUpperCase()}
                    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>

                        <ul className='bg-gray-100 list-none m-0 p-2 text-sm'>
                             {!userData.isAccountVerified &&  <li onClick={sendVerificationOTP} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
                            <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={Logout}>Logout</li>
                            {isOwner &&  <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={()=>navigate('/mybookings')}>My Bookings</li> }
                        </ul>

                    </div>
                    </div> :<button onClick={()=>navigate('/login')} 
                    className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                        Login
                    </button>}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <button onClick={()=>setIsMenuOpen(true)}>
                    <img src={assets.menuIcon} alt="menuIcon" className={`${isScrolled && 'invert'} h-4` } />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <img src={assets.closeIcon} alt="closeIcon"  className='h-6'/>
                    </button>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}

                    {/* display it only when the user is logged In */}
                    
                    {userData && ( <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                     onClick={()=>isOwner ? navigate('/owner'):setShowHotelRegistration(true)}>
                        {isOwner ? 'Dashboard' :'List your hotel'} 
                    </button>)}
                    
                   
                    {!userData &&
                    <button onClick={()=>{
                        navigate('/login');
                        setIsMenuOpen(false);
                    }} 
                    className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                        Login
                    </button>
                    }
                </div>
            </nav>
        
    );
}

export default Navbar;