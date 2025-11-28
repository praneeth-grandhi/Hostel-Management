import React, { useState } from 'react'

const RoomCardCarousel = ({ name = 'Hostel Name', image = './src/assets/img1.png', onBook = () => {} }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="max-w-xs bg-white rounded-lg shadow-lg hover:shadow-2xl mb-5 transition hover:scale-105 p-2 flex flex-col items-center text-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{name}</h3>

      <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-4 flex items-center justify-center relative">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">Image placeholder</span>
          </div>
        )}
        
        {/* Hover tooltip div - smooth transition */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-60 rounded-md flex items-center justify-center transition-opacity duration-300 ease-in-out ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-white text-center px-4">
            <p className="text-sm mb-3">Check out this hostel</p>
            <button
              onClick={onBook}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onBook}
        className="mt-auto inline-flex items-center px-3 py-1.5 mb-2 bg-blue-600 transition hover:bg-blue-700 text-white text-sm font-medium rounded"
      >
        Book Now
      </button>
    </div>
  )
}

export default RoomCardCarousel;
