import React, { useEffect, useMemo, useState } from 'react'
import HostelSidebar from '../../components/HostelSidebar'
import { FETCH_ROOMS, CREATE_ROOM, UPDATE_ROOM, DELETE_ROOM } from '../../Data/request'
import { DoorOpen, X, Wrench } from 'lucide-react'

const SHARING_OPTIONS = ['single', 'double', 'triple']
const STATUS_OPTIONS = ['available', 'maintenance', 'occupied']

// Transform backend room to frontend format
const transformFromBackend = (room) => ({
  id: room.id,
  code: room.room_code,
  floor: room.floor,
  type: room.sharing_type,
  rent: room.rent,
  status: room.status,
  isMaintenance: room.is_maintenance,
  features: {
    ac: room.has_ac,
    tv: room.has_tv,
    waterHeater: room.has_water_heater,
  },
})

// Transform frontend room to backend format
const transformToBackend = (room, hostelId) => ({
  hostel: hostelId,
  room_code: room.code,
  floor: room.floor,
  sharing_type: room.type,
  rent: room.rent,
  status: room.status || 'available',
  is_maintenance: room.isMaintenance || false,
  has_ac: room.features?.ac || false,
  has_tv: room.features?.tv || false,
  has_water_heater: room.features?.waterHeater || false,
})

// Floor Plan Visual Overlay
const FloorPlanOverlay = ({ rooms, onClose }) => {
  // Group rooms by floor (sorted descending - top floor first)
  const roomsByFloor = useMemo(() => {
    const map = {}
    rooms.forEach((r) => {
      const f = r.floor || 1
      if (!map[f]) map[f] = []
      map[f].push(r)
    })
    // Sort floors descending and rooms by code
    const sortedFloors = Object.keys(map)
      .map(Number)
      .sort((a, b) => b - a)
    return sortedFloors.map((floor) => ({
      floor,
      rooms: map[floor].sort((a, b) => (a.code || '').localeCompare(b.code || '')),
    }))
  }, [rooms])

  // Get room color based on status
  const getRoomStyle = (room) => {
    if (room.isMaintenance) {
      return {
        bg: 'bg-amber-100 hover:bg-amber-200 border-amber-300',
        icon: 'text-amber-600',
        label: 'Maintenance',
      }
    }
    if (room.status === 'occupied') {
      return {
        bg: 'bg-red-100 hover:bg-red-200 border-red-300',
        icon: 'text-red-600',
        label: 'Occupied',
      }
    }
    return {
      bg: 'bg-green-100 hover:bg-green-200 border-green-300',
      icon: 'text-green-600',
      label: 'Available',
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Floor Plan View</h2>
            <p className="text-sm text-gray-500 mt-1">Visual representation of all rooms</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-5 py-3 bg-gray-50 border-b">
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

        {/* Floor Plan Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {roomsByFloor.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DoorOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No rooms to display</p>
            </div>
          ) : (
            roomsByFloor.map(({ floor, rooms: floorRooms }) => (
              <div key={floor} className="bg-gray-50 rounded-xl p-4">
                {/* Floor Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    {floor}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Floor {floor}</h3>
                    <p className="text-xs text-gray-500">{floorRooms.length} room(s)</p>
                  </div>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {floorRooms.map((room) => {
                    const style = getRoomStyle(room)
                    return (
                      <div
                        key={room.id}
                        className={`relative p-3 rounded-lg border-2 ${style.bg} transition-colors cursor-pointer group`}
                        title={`Room ${room.code} - ${style.label} - ${room.type} - ₹${room.rent}`}
                      >
                        <div className="flex flex-col items-center">
                          {room.isMaintenance ? (
                            <Wrench className={`w-6 h-6 ${style.icon}`} />
                          ) : (
                            <DoorOpen className={`w-6 h-6 ${style.icon}`} />
                          )}
                          <span className="text-xs font-bold mt-1 text-gray-700">{room.code}</span>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {room.type} • ₹{room.rent}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Total: <strong>{rooms.length}</strong> rooms</span>
            <span className="text-green-600">Available: <strong>{rooms.filter(r => r.status === 'available' && !r.isMaintenance).length}</strong></span>
            <span className="text-red-600">Occupied: <strong>{rooms.filter(r => r.status === 'occupied').length}</strong></span>
            <span className="text-amber-600">Maintenance: <strong>{rooms.filter(r => r.isMaintenance).length}</strong></span>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const RoomForm = ({ initial = {}, onCancel, onSave }) => {
  const [code, setCode] = useState(initial.code || '')
  const [floor, setFloor] = useState(initial.floor ?? '')
  const [type, setType] = useState(initial.type || 'single')
  const [rent, setRent] = useState(initial.rent ?? '')
  const [isMaintenance, setIsMaintenance] = useState(initial.isMaintenance || false)
  const [features, setFeatures] = useState(initial.features || { ac: false, tv: false, waterHeater: false })

  useEffect(() => {
    setCode(initial.code || '')
    setFloor(initial.floor ?? '')
    setType(initial.type || 'single')
    setRent(initial.rent ?? '')
    setIsMaintenance(initial.isMaintenance || false)
    setFeatures(initial.features || { ac: false, tv: false, waterHeater: false })
  }, [initial])

  const toggleFeature = (key) => setFeatures((f) => ({ ...f, [key]: !f[key] }))

  const submit = (e) => {
    e.preventDefault()
    if (!code.trim()) return alert('Room code is required')
    const payload = {
      ...initial,
      code: code.trim(),
      floor: Number(floor) || 1,
      type,
      rent: Number(rent) || 0,
      status: initial.status || 'available',  // Status managed by bookings, default to available
      isMaintenance,
      features,
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial.id ? 'Edit Room' : 'Add New Room'}
          </h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Room Code *</span>
              <input 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g. 101" 
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Floor *</span>
              <input 
                value={floor} 
                onChange={(e) => setFloor(e.target.value)} 
                type="number" 
                min="1"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="1"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Type (Sharing)</span>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Monthly Rent (₹)</span>
              <input 
                value={rent} 
                onChange={(e) => setRent(e.target.value)} 
                type="number" 
                min="0"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="5000" 
              />
            </label>
          </div>

          {/* Maintenance Toggle */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-amber-800">Under Maintenance</span>
                <p className="text-xs text-amber-600 mt-0.5">Room won't be available for new bookings</p>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={isMaintenance} 
                  onChange={(e) => setIsMaintenance(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:bg-amber-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          {/* Features */}
          <div>
            <span className="text-sm font-medium text-gray-700 block mb-3">Room Features</span>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={features.ac} 
                  onChange={() => toggleFeature('ac')} 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Air Conditioning</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={features.tv} 
                  onChange={() => toggleFeature('tv')} 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Television</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={features.waterHeater} 
                  onChange={() => toggleFeature('waterHeater')} 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Water Heater</span>
              </label>
            </div>
          </div>

          {/* Status Info for existing rooms */}
          {initial.id && (
            <div className="p-3 bg-gray-50 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Current Status: <strong className={initial.status === 'available' ? 'text-green-600' : 'text-blue-600'}>{initial.status}</strong></span>
                <span className="text-gray-400">•</span>
                <span className="text-xs">Status changes automatically with bookings</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {initial.id ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Rooms = () => {
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [hostelData, setHostelData] = useState(null)
  const [rooms, setRooms] = useState([])
  const [floorFilter, setFloorFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showFloorPlan, setShowFloorPlan] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Fetch rooms when hostel is selected
  useEffect(() => {
    if (!selectedHostelId) {
      setRooms([])
      return
    }

    const fetchRooms = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await FETCH_ROOMS(selectedHostelId)
        setRooms(data.map(transformFromBackend))
      } catch (err) {
        console.error('Error fetching rooms:', err)
        setError(err.response?.data?.detail || 'Failed to load rooms')
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [selectedHostelId])

  const floors = useMemo(() => {
    const set = new Set(rooms.map((r) => r.floor))
    return Array.from(set).sort((a, b) => a - b)
  }, [rooms])

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (floorFilter !== 'all' && Number(floorFilter) !== r.floor) return false
      if (search && !(`${r.code} ${r.name} ${r.type} ${r.status} ${r.currentGuest || ''}`.toLowerCase().includes(search.toLowerCase()))) return false
      return true
    })
  }, [rooms, floorFilter, search])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach((r) => {
      const f = r.floor || 0
      if (!map[f]) map[f] = []
      map[f].push(r)
    })
    // sort floors descending
    const keys = Object.keys(map)
      .map(Number)
      .sort((a, b) => b - a)
    return keys.map((k) => ({ floor: k, rooms: map[k].sort((a, b) => (a.code || '').localeCompare(b.code || '')) }))
  }, [filtered])

  const addRoom = () => {
    if (!selectedHostelId) {
      alert('Please select a hostel first')
      return
    }
    setEditing(null)
    setShowForm(true)
  }

  const handleSave = async (room) => {
    if (!selectedHostelId) return

    setSaving(true)
    setError(null)
    try {
      const payload = transformToBackend(room, selectedHostelId)
      
      if (room.id) {
        // Update existing room
        const updated = await UPDATE_ROOM(room.id, payload)
        setRooms((s) => s.map((r) => (r.id === room.id ? transformFromBackend(updated) : r)))
      } else {
        // Create new room
        const created = await CREATE_ROOM(payload)
        setRooms((s) => [transformFromBackend(created), ...s])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error('Error saving room:', err)
      const errorMsg = err.response?.data?.floor || 
                       err.response?.data?.hostel || 
                       err.response?.data?.room_code ||
                       err.response?.data?.detail ||
                       'Failed to save room'
      alert(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (room) => {
    setEditing(room)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    
    try {
      await DELETE_ROOM(id)
      setRooms((s) => s.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Error deleting room:', err)
      alert(err.response?.data?.detail || 'Failed to delete room')
    }
  }

  return (
    <HostelSidebar
      selectedHostelId={selectedHostelId}
      onSelectHostel={setSelectedHostelId}
      onHostelData={setHostelData}
      title="Rooms"
      subtitle="Add, edit or view rooms grouped by floor"
    >
      <div className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* No hostel selected */}
        {!selectedHostelId && (
          <div className="p-12 bg-white border rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Hostel</h3>
            <p className="text-gray-500">Please select a hostel from the sidebar to view and manage its rooms.</p>
          </div>
        )}

        {/* Loading state */}
        {selectedHostelId && loading && (
          <div className="p-12 bg-white border rounded-lg text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        )}

        {/* Content when hostel is selected and not loading */}
        {selectedHostelId && !loading && (
          <>
            {/* Hostel Limits Info */}
            {hostelData && (hostelData.rooms || hostelData.floors) && (
              <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hostel Limits:</span>
                </div>
                {hostelData.rooms && (
                  <span className="text-gray-700">
                    <strong>{rooms.length}</strong> / {hostelData.rooms} rooms used
                  </span>
                )}
                {hostelData.floors && (
                  <span className="text-gray-700">
                    <strong>{floors.length}</strong> / {hostelData.floors} floors used
                  </span>
                )}
              </div>
            )}

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room number, status..."
                  className="px-3 py-2 border rounded w-full md:w-64"
                />
                <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="px-3 py-2 border rounded">
                  <option value="all">All floors</option>
                  {floors.map((f) => (
                    <option key={f} value={f}>Floor {f}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFloorPlan(true)} 
                  disabled={rooms.length === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border rounded hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <DoorOpen className="w-5 h-5" />
                  Floor Plan
                </button>
                <button onClick={addRoom} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Room
                </button>
              </div>
            </div>

            {showForm && (
              <RoomForm
                initial={editing || {}}
                onCancel={() => {
                  setShowForm(false)
                  setEditing(null)
                }}
                onSave={(payload) => {
                  if (editing && editing.id) payload.id = editing.id
                  handleSave(payload)
                }}
              />
            )}

            {showFloorPlan && (
              <FloorPlanOverlay
                rooms={rooms}
                onClose={() => setShowFloorPlan(false)}
              />
            )}

            {/* Rooms List */}
            {grouped.length === 0 ? (
              <div className="p-12 bg-white border rounded-lg text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No rooms found</h3>
                <p className="text-gray-500 mb-4">Add rooms to this hostel to get started.</p>
                <button onClick={addRoom} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add First Room
                </button>
              </div>
            ) : (
              grouped.map((grp) => (
                <section key={grp.floor} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Floor {grp.floor}</h3>
                      <p className="text-sm text-gray-500">{grp.rooms.length} room(s)</p>
                    </div>
                  </div>

                  <div className="divide-y">
                    {grp.rooms.map((r) => (
                      <div key={r.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 ${r.isMaintenance ? 'bg-amber-50/50' : ''}`}>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold ${
                          r.isMaintenance ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {r.code}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">Room {r.code}</span>
                            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">{r.type}</span>
                            {r.isMaintenance && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Maintenance
                              </span>
                            )}
                            <span className="ml-auto font-medium text-gray-700">₹{r.rent}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              r.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {r.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {[r.features?.ac && 'AC', r.features?.tv && 'TV', r.features?.waterHeater && 'Water Heater'].filter(Boolean).join(' • ') || 'No features'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(r)} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100">Edit</button>
                          <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 border rounded text-sm text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}
      </div>
    </HostelSidebar>
  )
}

export default Rooms
