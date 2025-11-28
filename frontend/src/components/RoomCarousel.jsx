import React from 'react'
import Slider from "react-slick";
import RoomCardCarousel from './RoomCardCarousel.jsx';
import { useNavigate } from 'react-router'
import './Carousel.css'   // added import for custom slick styles

const RoomCarousel = () => {
    const navigate = useNavigate()
    
    // Sample hostel data
    const sampleHostels = [
        { id: 1, name: 'Green Valley Hostel', image: './src/assets/img1.png', address: '123 Main St', contactPhone: '+1234567890', contactEmail: 'green@hostel.com', type: 'Boys', totalRooms: 50, floors: 5, description: 'Modern hostel with great amenities', amenities: ['WiFi', 'AC', 'Hot Water'] },
        { id: 2, name: 'Sunrise PG', image: './src/assets/img1.png', address: '456 Oak Ave', contactPhone: '+0987654321', contactEmail: 'sunrise@hostel.com', type: 'Girls', totalRooms: 30, floors: 3, description: 'Comfortable and safe accommodation', amenities: ['WiFi', 'Gym', 'Food'] },
        { id: 3, name: 'Urban Nest', image: './src/assets/img1.png', address: '789 Pine Rd', contactPhone: '+1122334455', contactEmail: 'urban@hostel.com', type: 'Co-ed', totalRooms: 45, floors: 4, description: 'Budget-friendly hostel in city center', amenities: ['WiFi', 'Kitchen', 'Common Area'] },
        { id: 4, name: 'Mountain View', image: './src/assets/img1.png', address: '321 Hill St', contactPhone: '+5544332211', contactEmail: 'mountain@hostel.com', type: 'Boys', totalRooms: 25, floors: 2, description: 'Peaceful hostel with scenic views', amenities: ['WiFi', 'Garden', 'Parking'] },
        { id: 5, name: 'City Central', image: './src/assets/img1.png', address: '654 Downtown Blvd', contactPhone: '+9876543210', contactEmail: 'citycentral@hostel.com', type: 'Girls', totalRooms: 60, floors: 6, description: 'Located in the heart of the city', amenities: ['WiFi', 'Restaurant', 'Laundry'] },
        { id: 6, name: 'Coastal Haven', image: './src/assets/img1.png', address: '987 Beach Rd', contactPhone: '+4433221100', contactEmail: 'coastal@hostel.com', type: 'Co-ed', totalRooms: 40, floors: 3, description: 'Beachside hostel with water sports', amenities: ['WiFi', 'Beach Access', 'Bar'] },
        { id: 7, name: 'Student Lodge', image: './src/assets/img1.png', address: '147 Campus Dr', contactPhone: '+1357924680', contactEmail: 'student@hostel.com', type: 'Boys', totalRooms: 70, floors: 7, description: 'Perfect for students near university', amenities: ['WiFi', 'Study Room', 'Cafeteria'] },
        { id: 8, name: 'Peaceful Retreat', image: './src/assets/img1.png', address: '258 Quiet Lane', contactPhone: '+9753086421', contactEmail: 'peaceful@hostel.com', type: 'Girls', totalRooms: 35, floors: 4, description: 'Serene environment away from city chaos', amenities: ['WiFi', 'Yoga Studio', 'Meditation'] },
    ]

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
            {sampleHostels.map((hostel) => (
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
