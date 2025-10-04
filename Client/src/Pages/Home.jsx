import React from 'react'
import Hero from '../Components/Hero';
import FeaturedDestination from '../Components/FeaturedDestination';
import ExclusiveOffers from '../Components/ExclusiveOffers';
import Testimonial from '../Components/Testimonial';
import NewsLetter from '../Components/NewsLetter';
import Footer from '../Components/Footer';
import RecommendedHotels from '../Components/RecommendedHotels';

const Home=()=>{
    return (
        <>
          <Hero></Hero>
          <FeaturedDestination></FeaturedDestination>
          <ExclusiveOffers/>
          <Testimonial/>
          <NewsLetter></NewsLetter>
          
        </>
    );
}

export default Home;