import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'hostelManagement:hostels'

function loadHostels() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveHostels(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

const sampleHostels = [
  {
    id: 'h_1',
    name: 'Green Valley Hostel',
    address: '12 MG Road, Cityville',
    contactPhone: '+91 98765 43210',
    contactEmail: 'green@hostel.example',
    totalRooms: 24,
    floors: 3,
    businessHours: '08:00 - 22:00',
    description: 'Cozy hostel with WiFi and meals included.',
    amenities: 'WiFi,Laundry,Meals,Parking',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h_2',
    name: 'Sunrise PG',
    address: '45 Park Street, Cityville',
    contactPhone: '+91 91234 56789',
    contactEmail: 'sunrise@pg.example',
    totalRooms: 18,
    floors: 2,
    businessHours: '09:00 - 21:00',
    description: 'Budget-friendly paying guest accommodations.',
    amenities: 'WiFi,Water Tank,Parking',
    createdAt: new Date().toISOString(),
  },
]

const blankForm = {
  name: '',
  address: '',
  contactPhone: '',
  contactEmail: '',
  totalRooms: '',
  floors: '',
  businessHours: '',
  description: '',
  amenities: '',
}

const HostelDetails = () => {
  const [hostels, setHostels] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const existing = loadHostels()
    if (Array.isArray(existing) && existing.length) {
      setHostels(existing)
    } else {
      setHostels(sampleHostels)
      saveHostels(sampleHostels)
    }
  }, [])

  const selectHostel = (id) => {
    const h = hostels.find((x) => x.id === id)
    if (!h) return
    setSelectedId(id)
    setForm({
      name: h.name || '',
      address: h.address || '',
      contactPhone: h.contactPhone || '',
      contactEmail: h.contactEmail || '',
      totalRooms: h.totalRooms || '',
      floors: h.floors || '',
      businessHours: h.businessHours || '',
      description: h.description || '',
      amenities: h.amenities || '',
    })
    setErrors({})
    setMessage('')
  }

  const newHostel = () => {
    setSelectedId(null)
    setForm(blankForm)
    setErrors({})
    setMessage('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Hostel name is required'
    if (!form.address.trim()) e.address = 'Address is required'
    return e
  }

  const handleSave = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    const all = [...hostels]
    if (selectedId) {
      const idx = all.findIndex((x) => x.id === selectedId)
      if (idx !== -1) {
        all[idx] = {
          ...all[idx],
          ...form,
          totalRooms: form.totalRooms ? Number(form.totalRooms) : '',
          floors: form.floors ? Number(form.floors) : '',
          updatedAt: new Date().toISOString(),
        }
        saveHostels(all)
        setHostels(all)
        setMessage('Hostel updated.')
      }
    } else {
      const id = `h_${Date.now().toString(36)}`
      const record = {
        id,
        ...form,
        totalRooms: form.totalRooms ? Number(form.totalRooms) : '',
        floors: form.floors ? Number(form.floors) : '',
        createdAt: new Date().toISOString(),
      }
      all.unshift(record)
      saveHostels(all)
      setHostels(all)
      setSelectedId(id)
      setMessage('Hostel created.')
    }

    setTimeout(() => setMessage(''), 2500)
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this hostel?')) return
    const updated = hostels.filter((h) => h.id !== id)
    saveHostels(updated)
    setHostels(updated)
    if (selectedId === id) {
      newHostel()
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-0">
      {/* Left: list */}
      <aside className="w-full md:w-72 bg-white border rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Hostels</h2>
          <button onClick={newHostel} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">New</button>
        </div>

        <div className="flex-1 overflow-auto space-y-2">
          {hostels.length === 0 && <div className="text-sm text-gray-500">No hostels yet.</div>}
          {hostels.map((h) => (
            <button
              key={h.id}
              onClick={() => selectHostel(h.id)}
              className={`w-full text-left p-3 rounded-md transition-colors border ${
                selectedId === h.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'
              }`}
            >
              <div className="font-medium">{h.name}</div>
              <div className="text-xs text-gray-500 truncate">{h.address}</div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(h.id)
                  }}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Right: form */}
      <section className="flex-1 bg-white border rounded-lg p-6 overflow-auto min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{selectedId ? 'Edit Hostel' : 'Create Hostel'}</h3>
          <div className="text-sm text-gray-500">{selectedId ? 'Editing existing hostel' : 'Fill details to create'}</div>
        </div>

        {message && <div className="mb-3 text-sm text-green-800 bg-green-100 p-2 rounded">{message}</div>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hostel name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`mt-1 w-full px-3 py-2 border rounded ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className={`mt-1 w-full px-3 py-2 border rounded ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact phone</label>
              <input value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact email</label>
              <input value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total rooms</label>
              <input type="number" min="0" value={form.totalRooms} onChange={(e) => setForm((f) => ({ ...f, totalRooms: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Floors</label>
              <input type="number" min="0" value={form.floors} onChange={(e) => setForm((f) => ({ ...f, floors: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business hours</label>
            <input value={form.businessHours} onChange={(e) => setForm((f) => ({ ...f, businessHours: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" placeholder="e.g. 09:00 - 21:00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" rows={3} placeholder="Brief description of the hostel" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
            <input value={form.amenities} onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded border-gray-200" placeholder="e.g. WiFi,Laundry,Meals,Parking" />
          </div>

          <div className="flex items-center gap-3 justify-end">
            {selectedId && (
              <button
                type="button"
                onClick={() => {
                  if (!confirm('Delete this hostel?')) return
                  handleDelete(selectedId)
                }}
                className="px-3 py-2 text-sm rounded border text-red-600"
              >
                Delete
              </button>
            )}
            <button type="button" onClick={newHostel} className="px-3 py-2 border rounded text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default HostelDetails
