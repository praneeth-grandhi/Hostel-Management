import React, { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'hostelManagement:bookings'

const sampleBookings = [
    {
        id: 'b_1',
        hostelId: 'h_1',
        hostelName: 'Green Valley Hostel',
        user: 'praneeth.gsk@gmail.com',
        from: '2025-11-01',
        to: '2025-11-05',
        nights: 4,
        amount: 1200,
        currency: 'INR',
        paid: true,
        paymentRef: 'PAY_abc123',
        feedback: '',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'b_2',
        hostelId: 'h_2',
        hostelName: 'Sunrise PG',
        user: 'praneeth.gsk@gmail.com',
        from: '2025-10-15',
        to: '2025-10-17',
        nights: 2,
        amount: 700,
        currency: 'INR',
        paid: false,
        paymentRef: '',
        feedback: 'Rooms were clean but WiFi was slow.',
        createdAt: new Date().toISOString(),
    },
]

function loadBookings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw)
    } catch {
        return null
    }
}
function saveBookings(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {}
}

export default function PastBookings() {
    const [bookings, setBookings] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [search, setSearch] = useState('')
    const [filterpaid, setFilterPaid] = useState('all') // all, paid, unpaid
    const [feedbackText, setFeedbackText] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const existing = loadBookings()
        if (existing && existing.length) {
            setBookings(existing)
        } else {
            setBookings(sampleBookings)
            saveBookings(sampleBookings)
        }
    }, [])

    useEffect(() => {
        if (selectedId) {
            const b = bookings.find((x) => x.id === selectedId)
            setFeedbackText(b?.feedback || '')
        } else {
            setFeedbackText('')
        }
    }, [selectedId, bookings])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return bookings.filter((b) => {
            if (filterpaid === 'paid' && !b.paid) return false
            if (filterpaid === 'unpaid' && b.paid) return false
            if (!q) return true
            return (
                (b.hostelName || '').toLowerCase().includes(q) ||
                (b.user || '').toLowerCase().includes(q) ||
                (b.paymentRef || '').toLowerCase().includes(q)
            )
        })
    }, [bookings, search, filterpaid])

    const selectBooking = (id) => {
        setSelectedId(id)
        setMessage('')
    }

    const saveFeedback = () => {
        if (!selectedId) return
        const idx = bookings.findIndex((b) => b.id === selectedId)
        if (idx === -1) return
        const updated = [...bookings]
        updated[idx] = { ...updated[idx], feedback: feedbackText }
        setBookings(updated)
        saveBookings(updated)
        setMessage('Feedback saved.')
        setTimeout(() => setMessage(''), 2500)
    }

    const rebook = () => {
        if (!selectedId) return
        const orig = bookings.find((b) => b.id === selectedId)
        if (!orig) return
        const id = `b_${Date.now().toString(36)}`
        const newBooking = {
            ...orig,
            id,
            from: orig.from,
            to: orig.to,
            createdAt: new Date().toISOString(),
            paid: false,
            paymentRef: '',
        }
        const updated = [newBooking, ...bookings]
        setBookings(updated)
        saveBookings(updated)
        setSelectedId(id)
        setMessage('Rebooking created (unpaid).')
        setTimeout(() => setMessage(''), 2500)
    }

    const cancelBooking = (id) => {
        if (!confirm('Cancel this booking?')) return
        const updated = bookings.filter((b) => b.id !== id)
        setBookings(updated)
        saveBookings(updated)
        if (selectedId === id) setSelectedId(null)
        setMessage('Booking cancelled.')
        setTimeout(() => setMessage(''), 2500)
    }

    return (
        // larger, centered container — not full width; larger base font
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-10 px-6 text-lg">
            {/* Left: list */}
            <aside className="w-full md:w-96 bg-white border rounded-xl p-5 flex flex-col max-h-[78vh] overflow-auto shadow-lg">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-semibold">Past Bookings</h2>
                        <p className="text-sm text-gray-500 mt-1">{bookings.length} bookings</p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedId(null)
                            setSearch('')
                            setFilterPaid('all')
                        }}
                        className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                    >
                        Reset
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by hostel, user or payment ref"
                        className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                </div>

                <div className="mb-4 flex gap-3 text-base">
                    <button
                        onClick={() => setFilterPaid('all')}
                        className={`px-3 py-2 rounded-lg font-medium ${filterpaid === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterPaid('paid')}
                        className={`px-3 py-2 rounded-lg font-medium ${filterpaid === 'paid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        Paid
                    </button>
                    <button
                        onClick={() => setFilterPaid('unpaid')}
                        className={`px-3 py-2 rounded-lg font-medium ${filterpaid === 'unpaid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        Unpaid
                    </button>
                </div>

                <div className="flex-1 overflow-auto space-y-3">
                    {filtered.length === 0 && <div className="text-base text-gray-500">No bookings found.</div>}
                    {filtered.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => selectBooking(b.id)}
                            className={`w-full text-left p-4 rounded-lg transition-colors border ${
                                selectedId === b.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-base">{b.hostelName}</div>
                                <div className={`text-sm font-semibold ${b.paid ? 'text-green-600' : 'text-red-600'}`}>{b.paid ? 'Paid' : 'Unpaid'}</div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {b.from} → {b.to} · {b.nights} night{b.nights > 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-gray-400 mt-3">₹{b.amount} · {b.user}</div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Right: details */}
            <main className="flex-1 bg-white border rounded-xl p-8 overflow-auto max-h-[78vh] shadow-lg">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-semibold">Booking details</h3>
                        <p className="text-base text-gray-500 mt-1">View and manage selected booking.</p>
                    </div>

                    <div className="text-base text-gray-500">{selectedId ? '' : 'Select a booking to see details'}</div>
                </div>

                {message && <div className="mb-4 text-base text-green-800 bg-green-100 p-3 rounded-lg">{message}</div>}

                {!selectedId ? (
                    <div className="text-base text-gray-600">Select a booking from the left to view details, payment and feedback options.</div>
                ) : (
                    (() => {
                        const b = bookings.find((x) => x.id === selectedId)
                        if (!b) return <div className="text-base text-gray-500">Booking not found.</div>
                        return (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-xl font-semibold">{b.hostelName}</h4>
                                        <p className="text-base text-gray-500">{b.user}</p>
                                        <div className="mt-4 text-base space-y-2">
                                            <div><strong>Dates:</strong> {b.from} → {b.to} ({b.nights} night{b.nights > 1 ? 's' : ''})</div>
                                            <div><strong>Amount:</strong> ₹{b.amount} {b.currency}</div>
                                            <div><strong>Status:</strong> <span className={b.paid ? 'text-green-600' : 'text-red-600'}>{b.paid ? 'Paid' : 'Unpaid'}</span></div>
                                            <div><strong>Booking ID:</strong> <span className="text-sm text-gray-500">{b.id}</span></div>
                                            <div><strong>Created:</strong> <span className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleString()}</span></div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg border">
                                            <div className="text-base font-medium">Payment details</div>
                                            <div className="text-sm text-gray-600 mt-3 space-y-1">
                                                <div><strong>Paid:</strong> {b.paid ? 'Yes' : 'No'}</div>
                                                <div><strong>Ref:</strong> {b.paymentRef || '-'}</div>
                                            </div>
                                            {!b.paid && (
                                                <div className="mt-4 flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            const updated = bookings.map((it) => (it.id === b.id ? { ...it, paid: true, paymentRef: `PAY_${Date.now().toString(36)}` } : it))
                                                            setBookings(updated)
                                                            saveBookings(updated)
                                                            setMessage('Payment simulated and marked as paid.')
                                                            setTimeout(() => setMessage(''), 2500)
                                                        }}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-base"
                                                    >
                                                        Pay now
                                                    </button>
                                                    <button onClick={() => cancelBooking(b.id)} className="px-4 py-2 border rounded-lg text-base">Cancel booking</button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg border">
                                            <div className="text-base font-medium">Feedback</div>
                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                rows={5}
                                                className="mt-3 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                                placeholder="Write feedback about your stay..."
                                            />
                                            <div className="mt-3 flex items-center justify-end gap-3">
                                                <button onClick={saveFeedback} className="px-4 py-2 bg-green-600 text-white rounded-lg text-base">Save feedback</button>
                                                <button onClick={rebook} className="px-4 py-2 border rounded-lg text-base">Rebook</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {b.feedback && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border text-base">
                                        <div className="font-medium mb-2">Previous feedback</div>
                                        <div className="text-gray-600">{b.feedback}</div>
                                    </div>
                                )}
                            </div>
                        )
                    })()
                )}
            </main>
        </div>
    )
}
