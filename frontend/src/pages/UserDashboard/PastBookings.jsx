import React, { useEffect, useState } from 'react'
import { DoorOpen, Calendar, Search } from 'lucide-react'
import { FETCH_BOOKINGS } from '../../Data/request'

const PastBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await FETCH_BOOKINGS()
                // Show all bookings
                setBookings(data)
                if (data.length > 0) setSelected(data[0])
            } catch (err) {
                console.error('Failed to fetch bookings:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [])

    const filtered = bookings.filter(b => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
            b.hostel_name?.toLowerCase().includes(q) ||
            b.room_code?.toLowerCase().includes(q) ||
            b.booking_reference?.toLowerCase().includes(q)
        )
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (bookings.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-6">
                <div className="bg-gray-50 border rounded-xl p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Bookings</h2>
                    <p className="text-gray-500">Your bookings will appear here once you have a room assigned.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by hostel or room..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bookings List */}
                <div className="lg:col-span-1 space-y-3">
                    {filtered.map(b => (
                        <div
                            key={b.id}
                            onClick={() => setSelected(b)}
                            className={`p-4 border rounded-xl cursor-pointer transition ${selected?.id === b.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <DoorOpen className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-semibold">{b.hostel_name}</p>
                                    <p className="text-sm text-gray-500">Room {b.room_code}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Booking Details */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <div className="bg-white border rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">{selected.hostel_name}</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Room</p>
                                    <p className="font-semibold">Room {selected.room_code}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Floor</p>
                                    <p className="font-semibold">{selected.room_floor}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Check-in</p>
                                    <p className="font-semibold">{selected.check_in_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Check-out</p>
                                    <p className="font-semibold">{selected.check_out_date || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Monthly Rent</p>
                                    <p className="font-semibold">₹{parseFloat(selected.rent_amount || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Booking Reference</p>
                                    <p className="font-semibold">{selected.booking_reference}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selected.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {selected.status === 'active' ? 'Active' : 'Completed'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border rounded-xl p-12 text-center">
                            <p className="text-gray-500">Select a booking to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PastBookings