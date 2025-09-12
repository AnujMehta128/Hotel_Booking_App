const { Hotel } = require("../models/hotel");
const User = require("../models/User");
const stringSimilarity=require('string-similarity');
const jwt=require('jsonwebtoken');

function normalizeAddressfunction({hotelName,houseNumber,buildingName,street,locality,hotelCity})
{
    return [
        hotelName.trim().toLowerCase(),
        houseNumber.trim().toLowerCase(),
        buildingName?.trim().toLowerCase() || "",
        street.trim().toLowerCase() ,
        locality.trim().toLowerCase() ,
        hotelCity.trim().toLowerCase() 
    ].join("-");
}


async function handleRegisterNewHotelRequest(req,res)
{
    try {
      
        const {hotelName,hotelAddress,hotelContact,hotelCity,houseNumber,street,floor,locality,pincode,isStandalone,buildingName}=req.body;
        const hotelOwner=req.user.id;
        
       // const existingHotel=await Hotel.findOne({ hotelName: hotelName.trim().toLowerCase(),hotelAddress:hotelAddress.trim().toLowerCase(),hotelCity:hotelCity.trim().toLowerCase()});

       // validation of hotel being standalone or in a building
       
       
        if (!hotelName || !hotelAddress || !hotelContact || !hotelCity || !houseNumber || !street || !locality || !pincode) {
            return res.json({
                success: false,
                message: "Missing required fields"
            });
        }

       
       
       if(!isStandalone && (!buildingName||buildingName.trim()===""))
       {
         return res.json({
             success: false,
              message: "Building name is required for non-standalone hotels" 
            })
       }

       if(!isStandalone && (typeof(floor)!=="number" || floor<0))
       {
        return res.json({ success: false, 
            message: "Floor must be a non-negative number" 
        })
       }
       
       const normalizedAddress=normalizeAddressfunction({hotelName,houseNumber,buildingName,street,locality,hotelCity});
        
        
        
        
        const existingHotels=await Hotel.find({pincode,normalizedAddress});

        if(existingHotels.some((h=>h.isStandalone)))
        {
            return res.json({
                success: false, 
                message: "A standalone hotel already exists at this address"
            })
        }

        if(isStandalone && existingHotels.length>0)
        {
            return res.json({
                success: false, 
                message: "Other hotels already exist at this address. Cannot register as standalone."
            })
        }

        if(!isStandalone && existingHotels.some((h=>h.floor===floor)))
        {
            return res.json({
                success: false,
                 message: "A hotel already exists on this floor at this address" 
            })
        }


        const duplicateHotel=existingHotels.find((h=>h.hotelName===hotelName.trim().toLowerCase()))

        if(duplicateHotel)
        {
            if(duplicateHotel.hotelOwner.toString()===hotelOwner)
            {
               return res.json({
                success: false,
                message: "Hotel Already Registered By You"
               })
            }

            else {
                return res.json({
                    success: false,
                    message: "Hotel Already Registered From Owner with Same Hotel Name at the Same Address"
                })
            }
        }


        const hotelsInPin=await Hotel.find({pincode});

        const fuzzyDuplicate=hotelsInPin.find((hotel)=>{
            const similarity=stringSimilarity.compareTwoStrings(hotel.normalizedHotelAddress,normalizedAddress);
            return similarity>0.8;
        })

        if(fuzzyDuplicate)
        {
            return res.json({
                 success: false, 
                message: "A hotel at a similar address already exists can you specify all the details coorectly"
            })
        }



        
        
        
      //  if (existingHotel) {
     /*       if (existingHotel.hotelOwner.toString() === hotelOwner) {
                return res.json({
                    success: false,
                    message: "Hotel Already Registered By You"
                })
            }
            else {

                return res.json({
                    success: false,
                    message: "Hotel Already Registered From Owner with Same Hotel Name at the Same Address"
                })
            }
       */ //}

        await Hotel.create({
            hotelName: hotelName.trim().toLowerCase(),
            houseNumber,
            buildingName,
            floor: isStandalone ? null : floor,
            street,
            locality,
            pincode,
            hotelAddress:hotelAddress.trim().toLowerCase(),
            normalizedHotelAddress: normalizedAddress,
            hotelContact,
            hotelOwner,
            hotelCity:hotelCity.trim().toLowerCase()
        })

        await User.findByIdAndUpdate(hotelOwner,{role:"hotelOwner"});

        const token=jwt.sign({_id:hotelId},process.env.JWT_SECRET,{
            expiresIn:'7d'
        });

        res.cookie('hotelToken',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        });
       
       
       
       
        return res.json({
            success:true,
            message:"Hotel Registered"
        })


    } catch (error)
    {
       
        return res.json({
            success:false,
            message:error.message
        })
    }
}


module.exports={
    handleRegisterNewHotelRequest
}
