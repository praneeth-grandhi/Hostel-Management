import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { 
  ArrowLeft, Phone, Mail, MapPin, Building2, Wifi, Utensils, Car, 
  Dumbbell, BookOpen, Coffee, Waves, TreePine, ShowerHead, Wind,
  Users, UserCircle, X, DoorOpen, AlertTriangle, IndianRupee, Wrench
} from 'lucide-react'
import { FETCH_PUBLIC_HOSTEL_BY_ID, FETCH_PUBLIC_HOSTEL_ROOMS } from '../../Data/request.js'

const DisplayHostelPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { hostelId } = useParams()
  
  const [hostel, setHostel] = useState(location.state?.hostel || null)
  const [loading, setLoading] = useState(!location.state?.hostel)
  const [error, setError] = useState(null)
  const [showRoomOverlay, setShowRoomOverlay] = useState(false)
  const [showEnquireForm, setShowEnquireForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    sharingType: '',
    message: ''
  })

  // Fetch hostel if not passed via state (direct URL access)
  useEffect(() => {
    const fetchHostelData = async () => {
      if (hostel) {
        setLoading(false)
        return
      }
      
      if (!hostelId) {
        setError('No hostel specified')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const data = await FETCH_PUBLIC_HOSTEL_BY_ID(hostelId)
        setHostel(data)
      } catch (err) {
        console.error('Failed to fetch hostel:', err)
        if (err.response?.status === 404) {
          setError('Hostel not found')
        } else {
          setError('Failed to load hostel details')
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchHostelData()
  }, [hostelId])

  const [roomData, setRoomData] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(false)

  // Fetch real room data from API
  useEffect(() => {
    const fetchRooms = async () => {
      if (!hostel?.id) return
      
      try {
        setRoomsLoading(true)
        const rooms = await FETCH_PUBLIC_HOSTEL_ROOMS(hostel.id)
        
        // Group rooms by floor
        const floorMap = {}
        rooms.forEach(room => {
          const floor = room.floor || 1
          if (!floorMap[floor]) {
            floorMap[floor] = []
          }
          floorMap[floor].push({
            id: room.id,
            roomNumber: room.room_code,
            isOccupied: room.status === 'occupied',
            isMaintenance: room.is_maintenance,
            sharingType: room.sharing_type,
            rent: room.rent,
            features: room.features || {}
          })
        })
        
        // Convert to array format sorted by floor
        const floorData = Object.keys(floorMap)
          .sort((a, b) => Number(a) - Number(b))
          .map(floor => ({
            floor: Number(floor),
            rooms: floorMap[floor].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }))
          }))
        
        setRoomData(floorData)
      } catch (err) {
        console.error('Failed to fetch rooms:', err)
      } finally {
        setRoomsLoading(false)
      }
    }
    
    fetchRooms()
  }, [hostel?.id])

  // Calculate available rooms
  const availableRooms = roomData.reduce((acc, floor) => {
    return acc + floor.rooms.filter(r => !r.isOccupied && !r.isMaintenance).length
  }, 0)

  const totalRooms = roomData.reduce((acc, floor) => acc + floor.rooms.length, 0) || hostel?.rooms || 0
  const occupancyRate = totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0
  const isFillingFast = availableRooms <= 5 || occupancyRate >= 80

  // Pricing data - use backend values or defaults
  const pricing = {
    single: { price: Number(hostel?.price_single) || 0, label: 'Single Sharing' },
    double: { price: Number(hostel?.price_double) || 0, label: 'Double Sharing' },
    triple: { price: Number(hostel?.price_triple) || 0, label: 'Triple Sharing' }
  }
  
  // Check if pricing is available
  const hasPricing = pricing.single.price > 0 || pricing.double.price > 0 || pricing.triple.price > 0

  // Hostel type config
  const hostelTypeConfig = {
    hostel: { label: 'Hostel', color: 'bg-blue-100 text-blue-800', icon: Building2 },
    pg: { label: 'Paying Guest', color: 'bg-purple-100 text-purple-800', icon: Building2 },
    hotel: { label: 'Hotel', color: 'bg-amber-100 text-amber-800', icon: Building2 }
  }

  // Category config
  const categoryConfig = {
    mens: { label: "Men's Only", color: 'bg-blue-500', icon: UserCircle },
    womens: { label: "Women's Only", color: 'bg-pink-500', icon: UserCircle },
    unisex: { label: 'Unisex', color: 'bg-green-500', icon: Users }
  }

  // Amenity icons mapping
  const amenityIcons = {
    'WiFi': Wifi,
    'wifi': Wifi,
    'AC': Wind,
    'ac': Wind,
    'Hot Water': ShowerHead,
    'hot water': ShowerHead,
    'Gym': Dumbbell,
    'gym': Dumbbell,
    'Food': Utensils,
    'food': Utensils,
    'Kitchen': Utensils,
    'kitchen': Utensils,
    'Common Area': Coffee,
    'common area': Coffee,
    'Garden': TreePine,
    'garden': TreePine,
    'Parking': Car,
    'parking': Car,
    'Restaurant': Utensils,
    'restaurant': Utensils,
    'Laundry': Waves,
    'laundry': Waves,
    'Study Room': BookOpen,
    'study room': BookOpen,
    'Cafeteria': Coffee,
    'cafeteria': Coffee
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitEnquiry = (e) => {
    e.preventDefault()
    alert(`Enquiry sent for ${hostel.name}!\nWe will contact you soon.`)
    setFormData({ name: '', email: '', phone: '', checkInDate: '', sharingType: '', message: '' })
    setShowEnquireForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg">Loading hostel details...</span>
        </div>
      </div>
    )
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 flex items-center gap-2 text-lg">
          <AlertTriangle className="w-6 h-6" />
          {error || 'Hostel not found'}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back to Home
        </button>
      </div>
    )
  }

  const typeInfo = hostelTypeConfig[hostel.hostel_type] || hostelTypeConfig.hostel
  const categoryInfo = hostel?.category ? categoryConfig[hostel.category] : null
  const TypeIcon = typeInfo.icon
  const CategoryIcon = categoryInfo?.icon

  // Parse amenities
  const amenitiesList = hostel.amenities 
    ? (typeof hostel.amenities === 'string' ? hostel.amenities.split(',').map(a => a.trim()) : hostel.amenities)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Image Gallery */}
          <div className="relative h-80 md:h-96 bg-linear-to-br from-blue-400 to-purple-500">
            {hostel.image ? (
              <img 
                src={hostel.image} 
                alt={hostel.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-24 h-24 text-white/50" />
              </div>
            )}
            
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hostel.hostel_type && (
                <span className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${typeInfo.color}`}>
                  <TypeIcon className="w-4 h-4" />
                  {typeInfo.label}
                </span>
              )}
              {categoryInfo && (
                <span className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 text-white ${categoryInfo.color}`}>
                  <CategoryIcon className="w-4 h-4" />
                  {categoryInfo.label}
                </span>
              )}
            </div>

            {/* Filling fast badge */}
            {isFillingFast && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                Rooms are filling fast!!
              </div>
            )}
          </div>

          {/* Hostel Info */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{hostel.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <p className="text-lg">
                    {hostel.address}
                    {hostel.city && `, ${hostel.city}`}
                    {hostel.state && `, ${hostel.state}`}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowRoomOverlay(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center gap-2 shadow-lg"
                >
                  <DoorOpen className="w-5 h-5" />
                  View Rooms
                </button>
                <button
                  onClick={() => setShowEnquireForm(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-600 text-sm font-medium">Total Rooms</p>
                </div>
                <p className="text-3xl font-bold text-blue-700">{hostel.rooms}</p>
              </div>

              <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DoorOpen className="w-5 h-5 text-green-600" />
                  <p className="text-gray-600 text-sm font-medium">Available</p>
                </div>
                <p className="text-3xl font-bold text-green-700">{availableRooms}</p>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <p className="text-gray-600 text-sm font-medium">Floors</p>
                </div>
                <p className="text-3xl font-bold text-purple-700">{hostel.floors}</p>
              </div>

              <div className="bg-linear-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="w-5 h-5 text-amber-600" />
                  <p className="text-gray-600 text-sm font-medium">Food</p>
                </div>
                <p className="text-xl font-bold text-amber-700">{hostel.food_provided ? 'Included' : 'Not Included'}</p>
              </div>
            </div>

            {/* Pricing Section */}
            {hasPricing && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                  Room Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(pricing).filter(([_, { price }]) => price > 0).map(([key, { price, label }]) => (
                    <div key={key} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition">
                      <p className="text-gray-600 font-medium mb-1">{label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
                        <span className="text-gray-500">/month per person</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {hostel.contact_phone && (
                <a href={`tel:${hostel.contact_phone}`} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition group">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-lg font-semibold text-gray-900">{hostel.contact_phone}</p>
                  </div>
                </a>
              )}
              {hostel.contact_email && (
                <a href={`mailto:${hostel.contact_email}`} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{hostel.contact_email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Description */}
            {hostel.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This {typeInfo.label}</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{hostel.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenitiesList.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || amenityIcons[amenity.toLowerCase()] || Building2
                    return (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-800 font-medium">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room Overlay Popup */}
      {showRoomOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Room Availability</h2>
                <p className="text-blue-100 mt-1">{hostel.floors} Floors • {hostel.rooms} Total Rooms</p>
              </div>
              <button
                onClick={() => setShowRoomOverlay(false)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Legend */}
            <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <DoorOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Available ({availableRooms})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <DoorOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Occupied ({roomData.reduce((acc, f) => acc + f.rooms.filter(r => r.isOccupied).length, 0)})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">Maintenance ({roomData.reduce((acc, f) => acc + f.rooms.filter(r => r.isMaintenance).length, 0)})</span>
              </div>
              {isFillingFast && (
                <div className="flex items-center gap-2 text-red-600 font-semibold animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                  Rooms are filling fast!!
                </div>
              )}
            </div>

            {/* Pricing Quick View */}
            {hasPricing && (
              <div className="px-6 py-4 bg-blue-50 border-b">
                <div className="flex flex-wrap gap-4 justify-center">
                  {pricing.single.price > 0 && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-gray-600">Single:</span>
                      <span className="font-bold text-gray-900 ml-2">₹{pricing.single.price.toLocaleString()}/month</span>
                    </div>
                  )}
                  {pricing.double.price > 0 && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-gray-600">Double:</span>
                      <span className="font-bold text-gray-900 ml-2">₹{pricing.double.price.toLocaleString()}/month</span>
                    </div>
                  )}
                  {pricing.triple.price > 0 && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-gray-600">Triple:</span>
                      <span className="font-bold text-gray-900 ml-2">₹{pricing.triple.price.toLocaleString()}/month</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Floor Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {roomsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-3 text-gray-600">Loading rooms...</span>
                </div>
              ) : roomData.length === 0 ? (
                <div className="text-center py-12">
                  <DoorOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No rooms have been added yet</p>
                  <p className="text-gray-400 text-sm mt-1">Contact the hostel for availability</p>
                </div>
              ) : (
                roomData.map((floorData) => (
                  <div key={floorData.floor} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm">
                        Floor {floorData.floor}
                      </div>
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-sm text-gray-500">
                        {floorData.rooms.filter(r => !r.isOccupied && !r.isMaintenance).length} available
                      </span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                      {floorData.rooms.map((room) => (
                        <div
                          key={room.roomNumber}
                          className={`
                            relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer
                          transition-all hover:scale-105 hover:shadow-lg group
                          ${room.isMaintenance 
                            ? 'bg-linear-to-br from-amber-400 to-amber-600 text-white'
                            : room.isOccupied 
                              ? 'bg-linear-to-br from-red-400 to-red-600 text-white' 
                              : 'bg-linear-to-br from-green-400 to-green-600 text-white'}
                        `}
                        title={`Room ${room.roomNumber} - ${room.isMaintenance ? 'Under Maintenance' : room.isOccupied ? 'Occupied' : 'Available'} (${room.sharingType})`}
                      >
                        {room.isMaintenance ? (
                          <Wrench className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <DoorOpen className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                        <span className="text-xs font-bold mt-0.5">{room.roomNumber}</span>
                        
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                            <p className="font-bold">Room {room.roomNumber}</p>
                            <p className={room.isMaintenance ? 'text-amber-300' : room.isOccupied ? 'text-red-300' : 'text-green-300'}>
                              {room.isMaintenance ? 'Under Maintenance' : room.isOccupied ? 'Occupied' : 'Available'}
                            </p>
                            <p className="text-gray-300 capitalize">{room.sharingType} sharing</p>
                            {room.rent > 0 && <p className="text-gray-300">₹{Number(room.rent).toLocaleString()}/month</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-bold text-green-600">{availableRooms}</span> rooms available out of <span className="font-bold">{totalRooms}</span>
              </p>
              <button
                onClick={() => {
                  setShowRoomOverlay(false)
                  setShowEnquireForm(true)
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquire Form Modal */}
      {showEnquireForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Book Your Room</h2>
                <p className="text-green-100 mt-1">{hostel.name}</p>
              </div>
              <button
                onClick={() => setShowEnquireForm(false)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Sharing Type</label>
                  <select
                    name="sharingType"
                    value={formData.sharingType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select sharing type</option>
                    <option value="single">Single Sharing - ₹12,000/month</option>
                    <option value="double">Double Sharing - ₹10,000/month</option>
                    <option value="triple">Triple Sharing - ₹8,000/month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any special requirements or questions?"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition shadow-lg"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisplayHostelPage
