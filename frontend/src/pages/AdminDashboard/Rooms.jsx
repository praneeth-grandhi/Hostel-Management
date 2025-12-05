import React, { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'hostelManagement:rooms_v4'
const SHARING_OPTIONS = ['single', 'double', 'triple']
const STATUS_OPTIONS = ['available', 'maintenance', 'occupied']

function loadRooms() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveRooms(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

function sampleRooms() {
  return [
    {
      id: 'r1',
      code: '101',
      name: 'Room 101',
      floor: 1,
      type: 'single',
      rent: 6000,
      status: 'available',
      features: { ac: true, tv: false, waterHeater: true },
    },
    {
      id: 'r2',
      code: '102',
      name: 'Room 102',
      floor: 1,
      type: 'double',
      rent: 9000,
      status: 'occupied',
      features: { ac: true, tv: true, waterHeater: true },
    },
    {
      id: 'r3',
      code: '201',
      name: 'Room 201',
      floor: 2,
      type: 'triple',
      rent: 3500,
      status: 'maintenance',
      features: { ac: false, tv: false, waterHeater: false },
    },
  ]
}

const RoomForm = ({ initial = {}, onCancel, onSave }) => {
  const [code, setCode] = useState(initial.code || '')
  const [name, setName] = useState(initial.name || '')
  const [floor, setFloor] = useState(initial.floor ?? '')
  const [type, setType] = useState(initial.type || 'single')
  const [rent, setRent] = useState(initial.rent ?? '')
  const [status, setStatus] = useState(initial.status || 'available')
  const [features, setFeatures] = useState(initial.features || { ac: false, tv: false, waterHeater: false })

  useEffect(() => {
    setCode(initial.code || '')
    setName(initial.name || '')
    setFloor(initial.floor ?? '')
    setType(initial.type || 'single')
    setRent(initial.rent ?? '')
    setStatus(initial.status || 'available')
    setFeatures(initial.features || { ac: false, tv: false, waterHeater: false })
  }, [initial])

  const toggleFeature = (key) => setFeatures((f) => ({ ...f, [key]: !f[key] }))

  const submit = (e) => {
    e.preventDefault()
    if (!code.trim()) return alert('Room code is required')
    const payload = {
      ...initial,
      code: code.trim(),
      name: name.trim() || `Room ${code.trim()}`,
      floor: Number(floor) || 0,
      type,
      rent: Number(rent) || 0,
      status,
      features,
    }
    onSave(payload)
  }

  return (
    <form onSubmit={submit} className="bg-white border rounded-lg p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm text-gray-600">Room Code *</span>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" placeholder="e.g. 101" />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Room Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" placeholder="e.g. Deluxe Single" />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Floor</span>
          <input value={floor} onChange={(e) => setFloor(e.target.value)} type="number" className="mt-1 w-full px-3 py-2 border rounded" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm text-gray-600">Type (Sharing)</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded">
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Rent</span>
          <input value={rent} onChange={(e) => setRent(e.target.value)} type="number" className="mt-1 w-full px-3 py-2 border rounded" placeholder="₹" />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
      </div>

      <div className="flex items-start">
        <div>
          <span className="text-sm text-gray-600 block mb-2">Features</span>
          <div className="flex gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={features.ac} onChange={() => toggleFeature('ac')} />
              AC
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={features.tv} onChange={() => toggleFeature('tv')} />
              TV
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={features.waterHeater} onChange={() => toggleFeature('waterHeater')} />
              Water Heater
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Room
        </button>
      </div>
    </form>
  )
}

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [floorFilter, setFloorFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const existing = loadRooms()
    if (!existing || !existing.length) {
      const s = sampleRooms()
      saveRooms(s)
      setRooms(s)
    } else {
      setRooms(existing)
    }
  }, [])

  useEffect(() => saveRooms(rooms), [rooms])

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
    setEditing(null)
    setShowForm(true)
  }

  const handleSave = (room) => {
    if (room.id) {
      setRooms((s) => s.map((r) => (r.id === room.id ? { ...r } : r)))
    } else {
      const id = `r${Date.now().toString(36)}`
      setRooms((s) => [{ id, ...room }, ...s])
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (room) => {
    setEditing(room)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this room?')) return
    setRooms((s) => s.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Rooms — Manage Listings</h1>
            <p className="text-sm text-gray-500">Add, edit or view rooms grouped by floor.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room number, status, sharing..."
              className="px-3 py-2 border rounded w-full md:w-64"
            />
            <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="px-3 py-2 border rounded">
              <option value="all">All floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  Floor {f}
                </option>
              ))}
            </select>
            <button onClick={addRoom} className="px-4 py-2 bg-green-600 text-white rounded">
              Add Room
            </button>
          </div>
        </header>

        {showForm && (
          <div>
            <RoomForm
              initial={editing || {}}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
              onSave={(payload) => {
                // preserve id when editing
                if (editing && editing.id) payload.id = editing.id
                handleSave(payload)
              }}
            />
          </div>
        )}

        <div className="space-y-6">
          {grouped.length === 0 ? (
            <div className="p-6 bg-white border rounded text-center text-gray-500">No rooms found.</div>
          ) : (
            grouped.map((grp) => (
              <section key={grp.floor} className="bg-white border rounded shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Floor {grp.floor}</h3>
                    <p className="text-sm text-gray-500">{grp.rooms.length} room(s)</p>
                  </div>
                  <div className="text-sm text-gray-600">Quick actions: <button onClick={() => { /* reserve placeholder */ }} className="ml-2 px-2 py-1 border rounded text-sm">Bulk edit</button></div>
                </div>

                <div className="divide-y">
                  {grp.rooms.map((r) => (
                    <div key={r.id} className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
                        {r.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900 truncate">{r.name || `Room ${r.code}`} · Floor {r.floor}</div>
                          <div className="text-xs text-gray-500 capitalize">{r.type}</div>
                          <div className="ml-auto text-sm text-gray-700">₹{r.rent}</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs ${r.status === 'available' ? 'bg-green-100 text-green-800' : r.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                            {r.status}
                          </span>
                          <span className="text-xs">{r.features?.ac ? 'AC' : ''}{r.features?.tv ? ' • TV' : ''}{r.features?.waterHeater ? ' • Water Heater' : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(r)} className="px-3 py-1 border rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(r.id)} className="px-3 py-1 border rounded text-sm text-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Rooms
