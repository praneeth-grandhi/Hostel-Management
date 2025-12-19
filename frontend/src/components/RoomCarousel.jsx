import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import RoomCardCarousel from './RoomCardCarousel.jsx';
import { useNavigate } from 'react-router'
import { FETCH_PUBLIC_HOSTELS } from '../Data/request.js'
import './Carousel.css'   // added import for custom slick styles

const RoomCarousel = () => {
    const navigate = useNavigate()
    const [hostels, setHostels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
      const fetchHostels = async () => {
        try {
          setLoading(true)
          const data = await FETCH_PUBLIC_HOSTELS()
          setHostels(data)
        } catch (err) {
          console.error('Failed to fetch hostels:', err)
          setError('Failed to load hostels')
        } finally {
          setLoading(false)
        }
      }
      fetchHostels()
    }, [])

    const handleBookClick = (hostel) => {
        navigate(`/hostel/${hostel.id}`, { state: { hostel } })
    }

    var settings = {
        dots: true,
        infinite: hostels.length > 4,
        speed: 500,
        slidesToShow: Math.min(4, hostels.length || 1),
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: Math.min(3, hostels.length || 1),
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: Math.min(2, hostels.length || 1),
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
    };

    if (loading) {
      return (
        <div className='container mx-auto px-5 py-10 my-5'>
          <div className="flex items-center justify-center h-40">
            <div className="flex items-center gap-3 text-gray-500">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading hostels...
            </div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className='container mx-auto px-5 py-10 my-5'>
          <div className="text-center text-gray-500">
            <p>{error}</p>
          </div>
        </div>
      )
    }

    if (hostels.length === 0) {
      return (
        <div className='container mx-auto px-5 py-10 my-5'>
          <div className="text-center text-gray-500">
            <p>No hostels available at the moment.</p>
          </div>
        </div>
      )
    }

    return (
        <div className='slider-container container mx-auto px-5 py-10 my-5'>
        <Slider {...settings}>
            {hostels.map((hostel) => (
                <RoomCardCarousel 
                    key={hostel.id}
                    name={hostel.name}
                    image={hostel.image}
                    hostelType={hostel.hostel_type}
                    city={hostel.city}
                    onBook={() => handleBookClick(hostel)}
                />
            ))}
        </Slider>
        </div>

    );
};

export default RoomCarousel;
