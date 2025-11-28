import React, { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'hostelManagement:myHostel'

const sampleState = {
  hostel: {
    name: 'Green Valley Hostel',
    address: '12 MG Road, Cityville',
    contactEmail: 'green@hostel.example',
    contactPhone: '+91 98765 43210',
    totalRooms: 24,
    floors: 3,
    description: 'Cozy hostel close to Cityville Tech Park with WiFi, meals and laundry.',
    amenities: ['WiFi', 'Laundry', 'Meals', 'Parking'],
    updatedAt: new Date().toISOString(),
  },
  rooms: [
    { id: 'r101', name: 'Room 101', type: 'Single', floor: 1, rent: 4500, occupied: true },
    { id: 'r102', name: 'Room 102', type: 'Double', floor: 1, rent: 6500, occupied: false },
    { id: 'r201', name: 'Room 201', type: 'Triple', floor: 2, rent: 7200, occupied: true },
    { id: 'r202', name: 'Room 202', type: 'Single', floor: 2, rent: 4800, occupied: false },
  ],
  bookedRoomIds: ['r102'],
  complaints: [
    {
      id: 'cmp-1',
      subject: 'Water heater not working',
      category: 'Maintenance',
      description: 'Room 102 geyser is not heating properly since yesterday.',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
  ],
  primaryBooking: {
    reference: 'GVH-2025-001',
    rooms: 1,
    people: 3,
    since: '2025-01-15',
    note: 'Primary stay in deluxe triple sharing room.',
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const MyHostel = () => {
  const [hostel, setHostel] = useState(sampleState.hostel)
  const [rooms, setRooms] = useState(sampleState.rooms)
  const [bookedRoomIds, setBookedRoomIds] = useState(sampleState.bookedRoomIds)
  const [complaints, setComplaints] = useState(sampleState.complaints)
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    category: 'Maintenance',
    description: '',
  })
  const [primaryBooking, setPrimaryBooking] = useState(sampleState.primaryBooking)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const existing = loadState()
    if (existing) {
      setHostel(existing.hostel)
      setRooms(existing.rooms)
      setBookedRoomIds(existing.bookedRoomIds || [])
      setComplaints(existing.complaints || [])
      setPrimaryBooking(existing.primaryBooking || sampleState.primaryBooking)
    } else {
      saveState(sampleState)
    }
  }, [])

  const persist = (next = {}) => {
    const payload = {
      hostel: next.hostel ?? hostel,
      rooms: next.rooms ?? rooms,
      bookedRoomIds: next.bookedRoomIds ?? bookedRoomIds,
      complaints: next.complaints ?? complaints,
      primaryBooking: next.primaryBooking ?? primaryBooking,
    }
    saveState(payload)
  }

  const setFlash = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 2500)
  }

  const cancelBooking = (id) => {
    if (!bookedRoomIds.includes(id)) return
    const updated = bookedRoomIds.filter((roomId) => roomId !== id)
    setBookedRoomIds(updated)
    persist({ bookedRoomIds: updated })
    const room = rooms.find((r) => r.id === id)
    setFlash(`${room?.name || 'Room'} booking cancelled.`)
  }

  const availableRooms = useMemo(
    () => rooms.filter((r) => !r.occupied && !bookedRoomIds.includes(r.id)),
    [rooms, bookedRoomIds]
  )

  const bookedRooms = rooms.filter((r) => bookedRoomIds.includes(r.id))

  const handleComplaintChange = (field, value) => {
    setComplaintForm((prev) => ({ ...prev, [field]: value }))
  }

  const submitComplaint = (event) => {
    event.preventDefault()
    if (!complaintForm.subject.trim() || !complaintForm.description.trim()) {
      return setFlash('Please fill in subject and description.')
    }

    const newComplaint = {
      ...complaintForm,
      id: `cmp-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    }

    const nextComplaints = [newComplaint, ...complaints]
    setComplaints(nextComplaints)
    persist({ complaints: nextComplaints })
    setComplaintForm({ subject: '', category: complaintForm.category, description: '' })
    setFlash('Complaint submitted. We will get back to you soon.')
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 text-lg space-y-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{hostel.name}</h1>
          <p className="text-base text-gray-600 mt-1">
            View your hostel details, track bookings, and raise complaints whenever you spot an issue.
          </p>
        </div>
        {message && <div className="text-base text-green-800 bg-green-100 px-4 py-2 rounded-lg">{message}</div>}
      </header>

      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-500">Total rooms</p>
            <p className="text-3xl font-semibold mt-2">{rooms.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-500">Available rooms</p>
            <p className="text-3xl font-semibold mt-2">{availableRooms.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-500">Rooms booked by you</p>
            <p className="text-3xl font-semibold mt-2">{bookedRooms.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Hostel information</h2>
            <dl className="space-y-3 text-base text-gray-700">
              <div>
                <dt className="font-medium text-gray-500">Address</dt>
                <dd>{hostel.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Contact email</dt>
                <dd>{hostel.contactEmail}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Contact phone</dt>
                <dd>{hostel.contactPhone}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Floors</dt>
                <dd>{hostel.floors}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Amenities</dt>
                <dd className="flex flex-wrap gap-2">
                  {hostel.amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                      {amenity}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <p className="text-sm text-gray-400 mt-4">Last updated: {new Date(hostel.updatedAt).toLocaleString()}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your bookings</h2>
            <p className="text-sm text-gray-500 mb-3">
              Includes your current hostel stay plus any extra rooms you have reserved.
            </p>
            <div className="border rounded-2xl p-4 mb-4 bg-blue-50/80">
              <p className="text-xs uppercase tracking-wide font-semibold text-blue-700">Current hostel booking</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">Reference {primaryBooking.reference}</p>
              <p className="text-sm text-gray-600">
                {primaryBooking.people} {primaryBooking.people === 1 ? 'person' : 'people'} · {primaryBooking.rooms}{' '}
                {primaryBooking.rooms === 1 ? 'room' : 'rooms'} · Since {new Date(primaryBooking.since).toLocaleDateString()}
              </p>
              {primaryBooking.note && <p className="text-sm text-gray-500 mt-1">{primaryBooking.note}</p>}
            </div>
            {bookedRooms.length === 0 ? (
              <p className="text-base text-gray-500">You have not booked any additional rooms yet.</p>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-auto">
                {bookedRooms.map((room) => (
                  <div key={room.id} className="border rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold">{room.name}</p>
                      <p className="text-sm text-gray-500">
                        {room.type} · Floor {room.floor} · ₹{room.rent}/month
                      </p>
                    </div>
                    <button
                      onClick={() => cancelBooking(room.id)}
                      className="px-4 py-2 border rounded-xl text-sm font-medium"
                    >
                      Cancel booking
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">Need another room? Speak with the hostel manager directly.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-base text-gray-700 leading-relaxed">{hostel.description}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Raise a complaint</h2>
            <p className="text-base text-gray-500">Let us know what's wrong so we can resolve it quickly.</p>
          </div>

          <form onSubmit={submitComplaint} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Subject</label>
              <input
                type="text"
                value={complaintForm.subject}
                onChange={(e) => handleComplaintChange('subject', e.target.value)}
                className="border rounded-xl px-3 py-2"
                placeholder="Short title"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Category</label>
              <select
                value={complaintForm.category}
                onChange={(e) => handleComplaintChange('category', e.target.value)}
                className="border rounded-xl px-3 py-2"
              >
                {['Maintenance', 'Security', 'Services', 'Other'].map((option) => (
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
              <button type="submit" className="px-5 py-2 rounded-xl text-base font-medium bg-blue-600 text-white">
                Submit complaint
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recent complaints</h3>
            {complaints.length === 0 ? (
              <p className="text-base text-gray-500">No complaints raised yet.</p>
            ) : (
              <div className="space-y-3">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-lg font-semibold">{complaint.subject}</p>
                        <p className="text-sm text-gray-500">{complaint.category}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          complaint.status === 'open'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {complaint.status === 'open' ? 'Pending review' : 'Resolved by admin'}
                      </span>
                    </div>
                    <p className="text-base text-gray-700">{complaint.description}</p>
                    <p className="text-xs text-gray-400">
                      Raised on {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyHostel;
