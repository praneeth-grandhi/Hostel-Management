import React, { useEffect, useState } from 'react'
import { DoorOpen, Calendar, MapPin, Phone, Mail, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { FETCH_BOOKINGS, CREATE_COMPLAINT, FETCH_COMPLAINTS } from '../../Data/request.js'

const MyHostel = () => {
  // State for data from backend
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeBooking, setActiveBooking] = useState(null)
  const [pastBookings, setPastBookings] = useState([])
  const [complaints, setComplaints] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    category: 'Maintenance',
    description: '',
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success') // 'success' or 'error'

  // Fetch user's bookings and complaints from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch bookings
        const bookings = await FETCH_BOOKINGS()

        // Find active booking (current stay)
        const active = bookings.find(b => b.status === 'active')
        setActiveBooking(active || null)

        // Past bookings (completed)
        const past = bookings.filter(b => b.status === 'completed')
        setPastBookings(past)

        // Fetch user's complaints
        try {
          const complaintsData = await FETCH_COMPLAINTS()
          setComplaints(complaintsData)
        } catch (err) {
          console.error('Failed to fetch complaints:', err)
        }

      } catch (err) {
        console.error('Failed to fetch bookings:', err)
        setError('Failed to load your booking information.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const setFlash = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleComplaintChange = (field, value) => {
    setComplaintForm((prev) => ({ ...prev, [field]: value }))
  }

  const submitComplaint = async (event) => {
    event.preventDefault()
    if (!complaintForm.title.trim() || !complaintForm.description.trim()) {
      return setFlash('Please fill in title and description.', 'error')
    }

    setSubmitting(true)
    try {
      const newComplaint = await CREATE_COMPLAINT({
        category: complaintForm.category.toLowerCase(),
        title: complaintForm.title,
        description: complaintForm.description,
      })

      // Add to local list
      setComplaints([newComplaint, ...complaints])
      setComplaintForm({ title: '', category: 'Maintenance', description: '' })
      setFlash('Complaint submitted successfully!')
    } catch (err) {
      console.error('Failed to submit complaint:', err)
      const errorMsg = err.response?.data?.detail || 'Failed to submit complaint. Please try again.'
      setFlash(errorMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your hostel information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  // No active booking
  if (!activeBooking) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="bg-gray-50 border rounded-xl p-12 text-center">
          <DoorOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Active Booking</h2>
          <p className="text-gray-500">You don't have any active hostel booking at the moment.</p>
          <p className="text-gray-500 mt-2">Contact an admin to get a room assigned.</p>
        </div>

        {/* Show past bookings if any */}
        {pastBookings.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-gray-50">
              <h2 className="text-xl font-semibold">Past Stays</h2>
            </div>
            <div className="divide-y">
              {pastBookings.map((booking) => (
                <div key={booking.id} className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <DoorOpen className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.hostel_name}</h3>
                    <p className="text-sm text-gray-500">
                      Room {booking.room_code} • {booking.check_in_date} → {booking.check_out_date}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Has active booking - show full dashboard
  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{activeBooking.hostel_name}</h1>
          <p className="text-base text-gray-600 mt-1">
            Your current hostel stay and booking details
          </p>
        </div>
        {message && (
          <div className={`text-base px-4 py-2 rounded-lg ${messageType === 'error'
            ? 'text-red-800 bg-red-100'
            : 'text-green-800 bg-green-100'
            }`}>
            {message}
          </div>
        )}
      </header>

      {/* Current Room Section - Prominent Display */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DoorOpen className="w-6 h-6" />
              <span className="text-blue-100 text-sm font-medium">Your Current Room</span>
            </div>
            <h2 className="text-4xl font-bold mb-1">Room {activeBooking.room_code}</h2>
            <p className="text-blue-100">Floor {activeBooking.room_floor}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Monthly Rent</p>
            <p className="text-3xl font-bold">₹{parseFloat(activeBooking.rent_amount || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Check-in Date</p>
            <p className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {activeBooking.check_in_date}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Check-out Date</p>
            <p className="font-semibold">{activeBooking.check_out_date || 'Ongoing'}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Booking Reference</p>
            <p className="font-semibold">{activeBooking.booking_reference}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Status</p>
            <p className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              Active
            </p>
          </div>
        </div>
      </section>

      {/* Past Bookings Section */}
      {pastBookings.length > 0 && (
        <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Past Stays</h2>
            <p className="text-sm text-gray-500 mt-1">Your previous bookings</p>
          </div>
          <div className="divide-y">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DoorOpen className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{booking.hostel_name}</h3>
                  <p className="text-sm text-gray-500">
                    Room {booking.room_code} • Floor {booking.room_floor}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{booking.check_in_date} → {booking.check_out_date}</p>
                  <p className="font-semibold text-gray-900">₹{parseFloat(booking.rent_amount || 0).toLocaleString()}/month</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Complaint Section */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Raise a Complaint
          </h2>
          <p className="text-base text-gray-500">Let us know what's wrong so we can resolve it quickly.</p>
        </div>

        <form onSubmit={submitComplaint} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={complaintForm.title}
              onChange={(e) => handleComplaintChange('title', e.target.value)}
              className="border rounded-xl px-3 py-2"
              placeholder="Short title for your complaint"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Category</label>
            <select
              value={complaintForm.category}
              onChange={(e) => handleComplaintChange('category', e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              {['Maintenance', 'Cleanliness', 'Security', 'Food', 'Staff', 'Other'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Description</label>
            <textarea
              value={complaintForm.description}
              onChange={(e) => handleComplaintChange('description', e.target.value)}
              className="border rounded-xl px-3 py-2 min-h-[120px]"
              placeholder="Describe the issue in detail"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-base font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </section>

      {/* Your Complaints Section */}
      {complaints.length > 0 && (
        <section className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Your Complaints</h2>
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="border rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{c.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {c.status === 'pending' ? 'Pending' : 'Resolved'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{c.description}</p>
                {c.admin_response && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Admin Response:</p>
                    <p className="text-sm text-blue-800">{c.admin_response}</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Submitted: {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MyHostel