import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import RoomCardCarousel from './RoomCardCarousel.jsx';
import { useNavigate } from 'react-router'
import './Carousel.css'   // added import for custom slick styles

const STORAGE_KEY = 'hostelManagement:hostels'

function loadHostels() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const RoomCarousel = () => {
    const navigate = useNavigate()
    const [hostels, setHostels] = useState([])

    // Sample hostel data (fallback if no data in storage)
    const sampleHostels = [
        { id: 'h_1', name: 'Green Valley Hostel', image: './src/assets/img1.png', address: '12 MG Road, Cityville', contactPhone: '+91 98765 43210', contactEmail: 'green@hostel.example', type: 'hostel', totalRooms: 24, floors: 3, description: 'Cozy hostel with WiFi and meals included.', amenities: 'WiFi,Laundry,Meals,Parking' },
        { id: 'h_2', name: 'Sunrise PG', image: './src/assets/img1.png', address: '45 Park Street, Cityville', contactPhone: '+91 91234 56789', contactEmail: 'sunrise@pg.example', type: 'pg', totalRooms: 18, floors: 2, description: 'Budget-friendly paying guest accommodations.', amenities: 'WiFi,Water Tank,Parking' },
        { id: 'h_3', name: 'Urban Nest', image: './src/assets/img1.png', address: '789 Pine Rd', contactPhone: '+1122334455', contactEmail: 'urban@hostel.com', type: 'hostel', totalRooms: 45, floors: 4, description: 'Budget-friendly hostel in city center', amenities: 'WiFi,Kitchen,Common Area' },
        { id: 'h_4', name: 'Mountain View', image: './src/assets/img1.png', address: '321 Hill St', contactPhone: '+5544332211', contactEmail: 'mountain@hostel.com', type: 'hostel', totalRooms: 25, floors: 2, description: 'Peaceful hostel with scenic views', amenities: 'WiFi,Garden,Parking' },
        { id: 'h_5', name: 'City Central', image: './src/assets/img1.png', address: '654 Downtown Blvd', contactPhone: '+9876543210', contactEmail: 'citycentral@hostel.com', type: 'hostel', totalRooms: 60, floors: 6, description: 'Located in the heart of the city', amenities: 'WiFi,Restaurant,Laundry' },
        { id: 'h_6', name: 'Coastal Haven', image: './src/assets/img1.png', address: '987 Beach Rd', contactPhone: '+4433221100', contactEmail: 'coastal@hostel.com', type: 'hostel', totalRooms: 40, floors: 3, description: 'Beachside hostel with water sports', amenities: 'WiFi,Beach Access,Bar' },
        { id: 'h_7', name: 'Student Lodge', image: './src/assets/img1.png', address: '147 Campus Dr', contactPhone: '+1357924680', contactEmail: 'student@hostel.com', type: 'hostel', totalRooms: 70, floors: 7, description: 'Perfect for students near university', amenities: 'WiFi,Study Room,Cafeteria' },
        { id: 'h_8', name: 'Peaceful Retreat', image: './src/assets/img1.png', address: '258 Quiet Lane', contactPhone: '+9753086421', contactEmail: 'peaceful@hostel.com', type: 'hostel', totalRooms: 35, floors: 4, description: 'Serene environment away from city chaos', amenities: 'WiFi,Yoga Studio,Meditation' },
    ]

    useEffect(() => {
      const existing = loadHostels()
      if (Array.isArray(existing) && existing.length) {
        setHostels(existing)
      } else {
        setHostels(sampleHostels)
      }
    }, [])

    const handleBookClick = (hostel) => {
        navigate('/displayHostel', { state: { hostel } })
    }

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
    };
    return (
        <div className='slider-container container mx-auto px-5 py-10 my-5'>
        <Slider {...settings}>
            {hostels.map((hostel) => (
                <RoomCardCarousel 
                    key={hostel.id}
                    name={hostel.name}
                    image={hostel.image}
                    onBook={() => handleBookClick(hostel)}
                />
            ))}
        </Slider>
        </div>

    );
};

export default RoomCarousel;
