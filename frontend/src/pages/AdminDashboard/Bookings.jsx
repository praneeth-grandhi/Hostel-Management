import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import HostelSidebar from '../../components/HostelSidebar'
import { FETCH_ROOMS, FETCH_BOOKINGS, SEARCH_USERS, SEND_OTP, VERIFY_OTP, CREATE_BOOKING, DELETE_BOOKING, CHECKOUT_BOOKING } from '../../Data/request'
import { DoorOpen, X, Wrench, UserPlus, ArrowLeft, Check, Loader2, Search, LogOut } from 'lucide-react'

// New Booking Overlay Component
const NewBookingOverlay = ({ hostelId, onClose, onBookingCreated, existingBookings }) => {
  const [step, setStep] = useState(1) // 1: Room Selection, 2: User Search, 3: OTP Verification, 4: Guest Details, 5: Confirmation
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(null)

  // React Hook Form for guest details
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: '',
    }
  })
  const guestDetails = watch() // Watch all form values

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [userFound, setUserFound] = useState(null)
  const [error, setError] = useState('')
  // New state for user search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch rooms for the hostel
  useEffect(() => {
    const fetchRooms = async () => {
      if (!hostelId) return
      setLoading(true)
      try {
        const data = await FETCH_ROOMS(hostelId)
        // Transform and mark occupied rooms based on existing bookings
        const transformedRooms = data.map(room => {
          const isBooked = existingBookings.some(
            b => b.roomNumber === room.room_code && b.status === 'active'
          )
          return {
            id: room.id,
            code: room.room_code,
            floor: room.floor,
            type: room.sharing_type,
            rent: room.rent,
            status: isBooked ? 'occupied' : room.status,
            isMaintenance: room.is_maintenance,
            features: {
              ac: room.has_ac,
              tv: room.has_tv,
              waterHeater: room.has_water_heater,
            },
          }
        })
        setRooms(transformedRooms)
      } catch (err) {
        console.error('Error fetching rooms:', err)
        setError('Failed to load rooms')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [hostelId, existingBookings])

  // Group rooms by floor
  const roomsByFloor = useMemo(() => {
    const map = {}
    rooms.forEach((r) => {
      const f = r.floor || 1
      if (!map[f]) map[f] = []
      map[f].push(r)
    })
    const sortedFloors = Object.keys(map).map(Number).sort((a, b) => b - a)
    return sortedFloors.map((floor) => ({
      floor,
      rooms: map[floor].sort((a, b) => (a.code || '').localeCompare(b.code || '')),
    }))
  }, [rooms])

  // Get room style based on status
  const getRoomStyle = (room) => {
    if (room.isMaintenance) {
      return { bg: 'bg-amber-100 border-amber-300', icon: 'text-amber-600', selectable: false }
    }
    if (room.status === 'occupied') {
      return { bg: 'bg-red-100 border-red-300', icon: 'text-red-600', selectable: false }
    }
    return { bg: 'bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer', icon: 'text-green-600', selectable: true }
  }

  // Handle room selection
  const handleRoomClick = (room) => {
    const style = getRoomStyle(room)
    if (!style.selectable) return
    setSelectedRoom(room)
  }

  // Search users by phone or email
  const handleUserSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a phone number or email to search')
      return
    }
    setSearching(true)
    setError('')
    try {
      const data = await SEARCH_USERS(searchQuery)
      setSearchResults(data.users || [])
      if (data.users?.length === 0) {
        setError('No users found. You can proceed with manual entry.')
      }
    } catch (err) {
      setError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  // Select a user from search results
  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setValue('name', `${user.first_name} ${user.last_name}`.trim())
    setValue('email', user.email)
    setValue('phone', user.phone_number || '')
    setError('')
  }

  // Send OTP via API
  const handleSendOtp = async () => {
    if (!selectedUser && !guestDetails.email && !guestDetails.phone) {
      setError('Please select a user or enter contact details')
      return
    }
    setError('')
    try {
      await SEND_OTP({
        user_id: selectedUser?.id,
        email: guestDetails.email || selectedUser?.email,
        phone: guestDetails.phone || selectedUser?.phone_number,
      })
      setOtpSent(true)
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    }
  }

  // Verify OTP via API (accepts any value)
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP')
      return
    }
    setVerifying(true)
    setError('')
    try {
      const data = await VERIFY_OTP({
        user_id: selectedUser?.id,
        otp: otp,
      })
      if (data.verified) {
        setOtpVerified(true)
        if (data.user) {
          setUserFound(data.user)
        }
        setStep(4) // Move to guest details
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  // Create booking via backend API
  const handleCreateBooking = async () => {
    setError('')
    try {
      // Prepare booking data for backend
      const bookingData = {
        user: selectedUser?.id || null,
        room: selectedRoom.id,
        hostel: hostelId,
        check_in_date: guestDetails.checkIn,
        check_out_date: guestDetails.checkOut || null,
        rent_amount: selectedRoom.rent,
        status: 'active',
        is_verified: true,
        notes: `Guest: ${guestDetails.name}, Email: ${guestDetails.email}, Phone: ${guestDetails.phone || 'N/A'}`,
      }

      const response = await CREATE_BOOKING(bookingData)

      // Create local booking object for UI update
      const localBooking = {
        id: response.booking_reference || `B-${String(Date.now()).slice(-6)}`,
        guest: guestDetails.name,
        email: guestDetails.email,
        phone: guestDetails.phone,
        roomNumber: selectedRoom.code,
        floor: selectedRoom.floor,
        sharingType: selectedRoom.type,
        rent: selectedRoom.rent,
        bookingDate: new Date().toISOString().slice(0, 10),
        checkIn: guestDetails.checkIn,
        checkOut: guestDetails.checkOut,
        status: 'active',
        userId: selectedUser?.id,
        backendId: response.id,
      }

      onBookingCreated(localBooking)
      onClose()
    } catch (err) {
      console.error('Booking creation failed:', err)
      setError('Failed to create booking. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-linear-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-white/20 rounded-full transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {step === 1 && 'Select a Room'}
                {step === 2 && 'Search User'}
                {step === 3 && 'Verify OTP'}
                {step === 4 && 'Guest Details'}
                {step === 5 && 'Confirm Booking'}
              </h2>
              <p className="text-blue-100 text-sm mt-0.5">
                Step {step} of 5
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Room Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Legend */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 font-medium">Legend:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-200 border border-green-400"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-200 border border-red-400"></div>
                  <span className="text-sm text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-200 border border-amber-400"></div>
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : roomsByFloor.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <DoorOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No rooms available</p>
                </div>
              ) : (
                roomsByFloor.map(({ floor, rooms: floorRooms }) => (
                  <div key={floor} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                        {floor}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Floor {floor}</h3>
                        <p className="text-xs text-gray-500">
                          {floorRooms.filter(r => r.status === 'available' && !r.isMaintenance).length} available
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {floorRooms.map((room) => {
                        const style = getRoomStyle(room)
                        const isSelected = selectedRoom?.id === room.id
                        return (
                          <div
                            key={room.id}
                            onClick={() => handleRoomClick(room)}
                            className={`relative p-3 rounded-lg border-2 transition-all ${style.bg} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : ''
                              } ${!style.selectable ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={`Room ${room.code} - ${room.isMaintenance ? 'Maintenance' : room.status} - ${room.type} - ₹${room.rent}`}
                          >
                            <div className="flex flex-col items-center">
                              {room.isMaintenance ? (
                                <Wrench className={`w-6 h-6 ${style.icon}`} />
                              ) : (
                                <DoorOpen className={`w-6 h-6 ${style.icon}`} />
                              )}
                              <span className="text-xs font-bold mt-1 text-gray-700">{room.code}</span>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}

              {/* Selected Room Info */}
              {selectedRoom && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Selected Room</h4>
                  <div className="flex items-center gap-6 text-sm">
                    <span><strong>Room:</strong> {selectedRoom.code}</span>
                    <span><strong>Floor:</strong> {selectedRoom.floor}</span>
                    <span><strong>Type:</strong> {selectedRoom.type}</span>
                    <span><strong>Rent:</strong> ₹{selectedRoom.rent}/month</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: User Search */}
          {step === 2 && (
            <div className="max-w-lg mx-auto space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Room:</strong> {selectedRoom.code} (Floor {selectedRoom.floor}) - ₹{selectedRoom.rent}/month
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Search for User</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Search by phone number or email to find existing user
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number or email..."
                />
                <button
                  onClick={handleUserSearch}
                  disabled={searching}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Found {searchResults.length} user(s):</p>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`p-4 border rounded-lg cursor-pointer transition ${selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.phone_number && <p className="text-sm text-gray-500">{user.phone_number}</p>}
                        </div>
                        {selectedUser?.id === user.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected User Info */}
              {selectedUser && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ User Selected</p>
                  <p className="text-sm text-green-700 mt-1">
                    {selectedUser.first_name} {selectedUser.last_name} - {selectedUser.email}
                  </p>
                </div>
              )}

              {/* Skip search option */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Can't find the user?</p>
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setStep(3)
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Continue with manual entry →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {step === 3 && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Verify Identity</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Send OTP to verify the user before creating booking
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                {selectedUser ? (
                  <>
                    <p className="text-sm text-gray-600">
                      <strong>User:</strong> {selectedUser.first_name} {selectedUser.last_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    {selectedUser.phone_number && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Phone:</strong> {selectedUser.phone_number}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> No user selected - proceeding with manual entry
                  </p>
                )}
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Send OTP
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Demo mode: Enter any 6-digit code</p>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.length < 6 || verifying}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>

                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full px-4 py-2 text-blue-600 hover:underline text-sm"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Guest Details */}
          {step === 4 && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-sm text-green-800 font-medium">✓ OTP Verified Successfully</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Guest name is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="guest@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    {...register('checkIn', { required: 'Check-in date is required' })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    {...register('checkOut')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional - leave blank if unknown</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Book!</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Please review the booking details below
                </p>
              </div>

              {(userFound || selectedUser) && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ User verified successfully</p>
                  <p className="text-xs text-green-600 mt-1">Booking will be linked to user's account</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg divide-y">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Room Details</h4>
                  <p className="text-gray-900"><strong>Room {selectedRoom.code}</strong> - Floor {selectedRoom.floor}</p>
                  <p className="text-gray-600 text-sm capitalize">{selectedRoom.type} sharing • ₹{selectedRoom.rent}/month</p>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Guest Details</h4>
                  <p className="text-gray-900">{guestDetails.name}</p>
                  <p className="text-gray-600 text-sm">{guestDetails.email}</p>
                  {guestDetails.phone && <p className="text-gray-600 text-sm">{guestDetails.phone}</p>}
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Dates</h4>
                  <p className="text-gray-900">Check-in: {guestDetails.checkIn}</p>
                  {guestDetails.checkOut && <p className="text-gray-600 text-sm">Check-out: {guestDetails.checkOut}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              disabled={!selectedRoom}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              Continue
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => {
                if (selectedUser) {
                  setStep(3)
                } else {
                  setError('Please search and select a user, or click "Continue with manual entry"')
                }
              }}
              disabled={!selectedUser}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              Continue to OTP
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleSubmit(() => {
                setError('')
                setStep(5)
              })}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Review Booking
            </button>
          )}

          {step === 5 && (
            <button
              onClick={handleCreateBooking}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Manual Entry Modal Component with React Hook Form
const ManualEntryModal = ({ onClose, onBookingCreated, bookingsCount }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      guest: '',
      roomNumber: '',
      floor: '',
      bookingDate: new Date().toISOString().slice(0, 10),
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: '',
    }
  })

  const onSubmit = (data) => {
    // Validate check-out date if provided
    if (data.checkOut && new Date(data.checkOut) <= new Date(data.checkIn)) {
      return // Form validation should handle this
    }

    const booking = {
      id: `B-${String(bookingsCount + 1).padStart(3, '0')}`,
      guest: data.guest,
      roomNumber: data.roomNumber,
      floor: parseInt(data.floor),
      bookingDate: data.bookingDate,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
    }

    onBookingCreated(booking)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Add New Booking</h2>
          <p className="text-sm text-gray-500 mt-1">Create a manual booking entry</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
              <input
                type="text"
                {...register('guest', { required: 'Guest name is required' })}
                placeholder="e.g., John Doe"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.guest ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.guest && <p className="text-red-500 text-xs mt-1">{errors.guest.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
              <input
                type="text"
                {...register('roomNumber', { required: 'Room number is required' })}
                placeholder="e.g., 101, 202"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor *</label>
              <input
                type="number"
                {...register('floor', { required: 'Floor is required', min: { value: 1, message: 'Floor must be at least 1' } })}
                placeholder="e.g., 1, 2, 3"
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.floor ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
              <input
                type="date"
                {...register('bookingDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
              <input
                type="date"
                {...register('checkIn', { required: 'Check-in date is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date <span className="text-gray-400">(Optional)</span></label>
              <input
                type="date"
                {...register('checkOut')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank if checkout date is unknown</p>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Bookings = () => {
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [floorFilter, setFloorFilter] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showNewBookingOverlay, setShowNewBookingOverlay] = useState(false)

  // Fetch bookings from backend API
  const fetchBookings = async () => {
    if (!selectedHostelId) {
      setBookings([])
      return
    }
    setLoading(true)
    try {
      const data = await FETCH_BOOKINGS(selectedHostelId)
      // Transform backend data to match frontend format
      const transformedBookings = data.map(booking => ({
        id: booking.booking_reference || booking.id,
        backendId: booking.id,
        guest: booking.notes?.match(/Guest: ([^,]+)/)?.[1] || 'Unknown Guest',
        email: booking.notes?.match(/Email: ([^,]+)/)?.[1] || '',
        phone: booking.notes?.match(/Phone: ([^,]+)/)?.[1] || '',
        roomNumber: booking.room_code || `Room ${booking.room}`,
        floor: booking.room_floor || 1,
        hostelName: booking.hostel_name,
        rent: parseFloat(booking.rent_amount) || 0,
        bookingDate: booking.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        checkIn: booking.check_in_date,
        checkOut: booking.check_out_date,
        status: booking.status,
        userId: booking.user,
      }))
      setBookings(transformedBookings)
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [selectedHostelId])

  const floors = useMemo(() => {
    const f = new Set(bookings.map((b) => b.floor))
    return Array.from(f).sort((a, b) => a - b)
  }, [bookings])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (query) {
        const q = query.toLowerCase()
        if (!(b.guest.toLowerCase().includes(q) || String(b.roomNumber).toLowerCase().includes(q))) return false
      }
      if (floorFilter !== 'all' && String(b.floor) !== String(floorFilter)) return false
      if (from && new Date(b.bookingDate) < new Date(from)) return false
      if (to && new Date(b.bookingDate) > new Date(to)) return false
      return true
    })
  }, [bookings, query, floorFilter, from, to])

  const handleDelete = async (booking) => {
    if (!confirm(`Delete booking for ${booking.guest}?`)) return
    try {
      await DELETE_BOOKING(booking.backendId)
      fetchBookings() // Refetch from backend
    } catch (err) {
      console.error('Failed to delete booking:', err)
      alert('Failed to delete booking. Please try again.')
    }
  }

  const handleCheckout = async (booking) => {
    if (!confirm(`Checkout ${booking.guest}? This will mark the room as available.`)) return
    try {
      await CHECKOUT_BOOKING(booking.backendId)
      fetchBookings() // Refetch from backend
    } catch (err) {
      console.error('Failed to checkout booking:', err)
      alert('Failed to checkout. Please try again.')
    }
  }

  const exportCSV = () => {
    const rows = [
      ['id', 'guest', 'roomNumber', 'floor', 'bookingDate', 'checkIn', 'checkOut'],
      ...filtered.map((b) => [b.id, b.guest, b.roomNumber, String(b.floor), b.bookingDate, b.checkIn, b.checkOut]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookings.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <HostelSidebar
      selectedHostelId={selectedHostelId}
      onSelectHostel={setSelectedHostelId}
      title="Bookings"
      subtitle="Manage room bookings and reservations"
    >
      <div className="space-y-6">
        {/* Filters & Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 rounded-lg border">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guest or room #"
              className="px-3 py-2 border rounded w-48"
            />
            <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="px-3 py-2 border rounded">
              <option value="all">All floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border rounded">
              <label className="text-xs text-gray-500">From</label>
              <input type="date" className="text-sm bg-transparent" value={from} onChange={(e) => setFrom(e.target.value)} />
              <label className="text-xs text-gray-500 ml-2">To</label>
              <input type="date" className="text-sm bg-transparent" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <button onClick={() => { setQuery(''); setFloorFilter('all'); setFrom(''); setTo('') }} className="px-3 py-2 border rounded hover:bg-gray-50">
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="px-3 py-2 border rounded hover:bg-gray-50">
              Export CSV
            </button>
            <button
              onClick={() => setShowNewBookingOverlay(true)}
              disabled={!selectedHostelId}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              New Booking
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Manual Entry
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {filtered.length} booking(s)</div>
            <div className="text-sm text-gray-500">Total: {bookings.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Guest</th>
                  <th className="p-3">Room #</th>
                  <th className="p-3">Check-in</th>
                  <th className="p-3">Check-out</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500">No bookings found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{b.id}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{b.guest}</p>
                          {b.email && <p className="text-xs text-gray-500">{b.email}</p>}
                        </div>
                      </td>
                      <td className="p-3 font-medium">{b.roomNumber}</td>
                      <td className="p-3">{b.checkIn}</td>
                      <td className="p-3">{b.checkOut || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {b.status === 'active' ? 'Active' : b.status === 'completed' ? 'Checked Out' : b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {b.status === 'active' && (
                            <button
                              onClick={() => handleCheckout(b)}
                              className="px-2 py-1 border border-green-300 rounded text-sm text-green-600 hover:bg-green-50 flex items-center gap-1"
                            >
                              <LogOut className="w-3 h-3" />
                              Checkout
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(b)}
                            className="px-2 py-1 border rounded text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Booking Modal */}
      {showAddForm && (
        <ManualEntryModal
          onClose={() => setShowAddForm(false)}
          onBookingCreated={() => {
            fetchBookings() // Refetch from backend
          }}
          bookingsCount={bookings.length}
        />
      )}

      {/* New Booking Overlay */}
      {showNewBookingOverlay && selectedHostelId && (
        <NewBookingOverlay
          hostelId={selectedHostelId}
          existingBookings={bookings}
          onClose={() => setShowNewBookingOverlay(false)}
          onBookingCreated={() => {
            fetchBookings() // Refetch from backend
          }}
        />
      )}
    </HostelSidebar>
  )
}

export default Bookings
