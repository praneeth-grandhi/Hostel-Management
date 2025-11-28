import React from 'react'

const CarouselComponent = ({ image, title }) => {
  return (
    <div className="container bg-blue-900 p-5 my-8 rounded-lg text-center text-white font-bold text-2xl h-80 flex items-center justify-center relative overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
      <span className="relative z-10">{title}</span>
    </div>
  )
}

export default CarouselComponent;
