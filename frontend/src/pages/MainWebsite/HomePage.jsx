import { SearchIcon } from 'lucide-react'
import Carousel from '../../components/Carousel.jsx'
import RoomCarousel from '../../components/RoomCarousel.jsx'
import OffersSection from '../../components/OffersSection.jsx'


const HomePage = () => {
  return (
    <div className='container mx-auto p-4 my-5'>
      <Carousel />
      <div className='flex items-center gap-2 border border-gray-300 rounded-md pl-5 py-2 my-10'>
        <SearchIcon />
        <input type="text" className='text-2xl py-2 pb-2 px-100' placeholder='Search Hostel or Location' />
        <button className='bg-green-600 text-lg text-white px-20 ml-10 py-3 rounded-md'>Search</button>
      </div>
      <OffersSection />
      <h1 className='text-3xl font-semibold p-4'>Book your Room!!</h1>
      <RoomCarousel />
    </div>
  )
}

export default HomePage;