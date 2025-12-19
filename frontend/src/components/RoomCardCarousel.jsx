import React, { useState } from 'react'
import { Building2, MapPin } from 'lucide-react'

const RoomCardCarousel = ({ 
  name = 'Hostel Name', 
  image = '', 
  hostelType = 'hostel',
  city = '',
  onBook = () => {} 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const typeLabels = {
    hostel: 'Hostel',
    pg: 'PG',
    hotel: 'Hotel'
  }

  const typeColors = {
    hostel: 'bg-blue-100 text-blue-700',
    pg: 'bg-purple-100 text-purple-700',
    hotel: 'bg-amber-100 text-amber-700'
  }

  return (
    <div 
      className="max-w-xs bg-white rounded-xl shadow-lg hover:shadow-2xl mb-5 transition-all duration-300 hover:scale-105 p-3 flex flex-col text-center relative mx-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="w-full h-44 bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
            <Building2 className="w-12 h-12 text-white/70" />
          </div>
        )}
        
        {/* Type Badge */}
        {hostelType && (
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${typeColors[hostelType] || typeColors.hostel}`}>
            {typeLabels[hostelType] || 'Hostel'}
          </div>
        )}
        
        {/* Hover overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={onBook}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded-lg shadow-lg"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{name}</h3>
      
      {city && (
        <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{city}</span>
        </div>
      )}

      <button
        onClick={onBook}
        className="mt-auto w-full py-2 bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-lg"
      >
        Book Now
      </button>
    </div>
  )
}

export default RoomCardCarousel;
