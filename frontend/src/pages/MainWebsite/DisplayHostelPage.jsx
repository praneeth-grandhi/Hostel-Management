import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowLeft, Phone, Mail, MapPin, Users, Building2, Wifi, Sofa, Utensils } from 'lucide-react'

const DisplayHostelPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showEnquireForm, setShowEnquireForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    numberOfPeople: '',
    message: ''
  })

  const hostel = location.state?.hostel || null

  if (!hostel) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-gray-500 text-lg">No hostel selected</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back to Home
        </button>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitEnquiry = (e) => {
    e.preventDefault()
    // Here you can add logic to send enquiry
    alert(`Enquiry sent for ${hostel.name}!\nWe will contact you soon.`)
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkInDate: '',
      numberOfPeople: '',
      message: ''
    })
    setShowEnquireForm(false)
  }

  // Amenity icons mapping
  const amenityIcons = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'AC': <Building2 className="w-5 h-5" />,
    'Hot Water': <Building2 className="w-5 h-5" />,
    'Gym': <Users className="w-5 h-5" />,
    'Food': <Utensils className="w-5 h-5" />,
    'Kitchen': <Utensils className="w-5 h-5" />,
    'Common Area': <Sofa className="w-5 h-5" />,
    'Garden': <Building2 className="w-5 h-5" />,
    'Parking': <Building2 className="w-5 h-5" />,
    'Restaurant': <Utensils className="w-5 h-5" />,
    'Laundry': <Building2 className="w-5 h-5" />,
    'Beach Access': <Building2 className="w-5 h-5" />,
    'Bar': <Sofa className="w-5 h-5" />,
    'Study Room': <Building2 className="w-5 h-5" />,
    'Cafeteria': <Utensils className="w-5 h-5" />,
    'Yoga Studio': <Users className="w-5 h-5" />,
    'Meditation': <Users className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="w-full h-96 bg-gray-200 overflow-hidden">
            <img 
              src={hostel.image} 
              alt={hostel.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Hostel Title and Type */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{hostel.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <p className="text-lg">{hostel.address}</p>
                  </div>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <p className="text-green-800 font-semibold">{hostel.type}</p>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-600 text-sm">Total Rooms</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{hostel.totalRooms}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <p className="text-gray-600 text-sm">Floors</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{hostel.floors}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <p className="text-gray-600 text-sm">Phone</p>
                </div>
                <p className="text-lg font-bold text-purple-600">{hostel.contactPhone}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <p className="text-gray-600 text-sm">Email</p>
                </div>
                <p className="text-sm font-bold text-orange-600 break-all">{hostel.contactEmail}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Hostel</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{hostel.description}</p>
            </div>

            {/* Amenities */}
            {hostel.amenities && hostel.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {hostel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                      <div className="text-blue-600">
                        {amenityIcons[amenity] || <Building2 className="w-5 h-5" />}
                      </div>
                      <span className="text-gray-800 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enquire Now Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowEnquireForm(!showEnquireForm)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                {showEnquireForm ? 'Close' : 'Enquire Now'}
              </button>
            </div>

            {/* Enquire Form */}
            {showEnquireForm && (
              <div className="mt-8 bg-gray-50 p-8 rounded-lg border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Your Enquiry</h3>
                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Number of People</label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Number of people"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      rows="4"
                      placeholder="Any special requirements or questions?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayHostelPage
