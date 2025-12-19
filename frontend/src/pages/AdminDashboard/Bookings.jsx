import React, { useEffect, useMemo, useState } from 'react'
import HostelSidebar from '../../components/HostelSidebar'

const STORAGE_KEY = 'hostelManagement:bookings_v1'

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveBookings(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

function sampleBookings() {
  const now = new Date()
  const d1 = new Date(now.getTime() - 3 * 24 * 3600 * 1000)
  const d2 = new Date(now.getTime() + 2 * 24 * 3600 * 1000)
  const d3 = new Date(now.getTime() + 10 * 24 * 3600 * 1000)

  return [
    {
      id: 'B-001',
      guest: 'Aman Singh',
      roomNumber: '101',
      floor: 1,
      bookingDate: d1.toISOString().slice(0, 10),
      checkIn: d2.toISOString().slice(0, 10),
      checkOut: d3.toISOString().slice(0, 10),
    },
    {
      id: 'B-002',
      guest: 'Priya Sharma',
      roomNumber: '202',
      floor: 2,
      bookingDate: new Date().toISOString().slice(0, 10),
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: new Date(now.getTime() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    },
    {
      id: 'B-003',
      guest: 'Ravi Kumar',
      roomNumber: '102',
      floor: 1,
      bookingDate: new Date().toISOString().slice(0, 10),
      checkIn: new Date(now.getTime() + 1 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      checkOut: new Date(now.getTime() + 4 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    },
  ]
}

const Bookings = () => {
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [bookings, setBookings] = useState([])
  const [query, setQuery] = useState('')
  const [floorFilter, setFloorFilter] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBooking, setNewBooking] = useState({
    guest: '',
    roomNumber: '',
    floor: '',
    bookingDate: new Date().toISOString().slice(0, 10),
    checkIn: new Date().toISOString().slice(0, 10),
    checkOut: '',
  })
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    // Load bookings for selected hostel (currently using localStorage)
    const existing = loadBookings()
    if (existing && existing.length) setBookings(existing)
    else {
      const s = sampleBookings()
      saveBookings(s)
      setBookings(s)
    }
  }, [selectedHostelId])

  useEffect(() => saveBookings(bookings), [bookings])

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

  const handleDelete = (id) => {
    if (!confirm('Delete this booking?')) return
    setBookings((s) => s.filter((b) => b.id !== id))
  }

  const handleAddBooking = () => {
    // Validation
    if (!newBooking.guest.trim()) {
      setFormMessage('Guest name is required.')
      return
    }
    if (!newBooking.roomNumber.trim()) {
      setFormMessage('Room number is required.')
      return
    }
    if (!newBooking.floor) {
      setFormMessage('Floor is required.')
      return
    }
    if (!newBooking.checkIn) {
      setFormMessage('Check-in date is required.')
      return
    }
    // Check-out is now optional
    if (newBooking.checkOut && new Date(newBooking.checkOut) <= new Date(newBooking.checkIn)) {
      setFormMessage('Check-out must be after check-in.')
      return
    }

    // Generate new ID
    const id = `B-${String(bookings.length + 1).padStart(3, '0')}`

    // Create booking object
    const booking = {
      id,
      guest: newBooking.guest,
      roomNumber: newBooking.roomNumber,
      floor: parseInt(newBooking.floor),
      bookingDate: newBooking.bookingDate,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
    }

    // Add to bookings
    setBookings([booking, ...bookings])

    // Reset form
    setNewBooking({
      guest: '',
      roomNumber: '',
      floor: '',
      bookingDate: new Date().toISOString().slice(0, 10),
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: '',
    })

    setFormMessage('')
    setShowAddForm(false)
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
              onClick={() => { setShowAddForm(true); setFormMessage('') }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Booking
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
                  <th className="p-3">Floor</th>
                  <th className="p-3">Booking Date</th>
                  <th className="p-3">Check-in</th>
                  <th className="p-3">Check-out</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
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
                      <td className="p-3">{b.guest}</td>
                      <td className="p-3">{b.roomNumber}</td>
                      <td className="p-3">{b.floor}</td>
                      <td className="p-3">{b.bookingDate}</td>
                      <td className="p-3">{b.checkIn}</td>
                      <td className="p-3">{b.checkOut || '-'}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => alert(JSON.stringify(b, null, 2))} className="px-2 py-1 border rounded text-sm hover:bg-gray-100">
                            View
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="px-2 py-1 border rounded text-sm text-red-600 hover:bg-red-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Add New Booking</h2>
              <p className="text-sm text-gray-500 mt-1">Create a manual booking entry</p>
            </div>

            <div className="p-6 space-y-4">
              {formMessage && (
                <div className={`p-3 rounded-lg text-sm ${formMessage.includes('required') || formMessage.includes('must be') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {formMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                <input
                  type="text"
                  value={newBooking.guest}
                  onChange={(e) => setNewBooking({ ...newBooking, guest: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                <input
                  type="text"
                  value={newBooking.roomNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                  placeholder="e.g., 101, 202"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor *</label>
                <input
                  type="number"
                  value={newBooking.floor}
                  onChange={(e) => setNewBooking({ ...newBooking, floor: e.target.value })}
                  placeholder="e.g., 1, 2, 3"
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                <input
                  type="date"
                  value={newBooking.bookingDate}
                  onChange={(e) => setNewBooking({ ...newBooking, bookingDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                <input
                  type="date"
                  value={newBooking.checkIn}
                  onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date <span className="text-gray-400">(Optional)</span></label>
                <input
                  type="date"
                  value={newBooking.checkOut}
                  onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank if checkout date is unknown</p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => { setShowAddForm(false); setFormMessage('') }}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </HostelSidebar>
  )
}

export default Bookings
