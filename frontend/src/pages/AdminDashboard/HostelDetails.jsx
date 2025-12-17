import { useEffect, useState } from 'react'
import { FETCH_HOSTELS } from '../../Data/request.js'

// Sample data for testing (will be replaced by API calls)
const sampleHostels = [
  {
    id: 'h_1',
    name: 'Green Valley Hostel',
    address: '12 MG Road, Cityville',
    city: 'Cityville',
    state: 'State',
    country: 'India',
    zip_code: '500001',
    contact_phone: '+91 98765 43210',
    contact_email: 'green@hostel.example',
    rooms: 24,
    floors: 3,
    business_hours: '08:00 - 22:00',
    hostel_type: 'hostel',
    food_provided: true,
    gst_number: 'GST123456789ABCD',
    fssai_license: 'FSSAI12345678',
  },
  {
    id: 'h_2',
    name: 'Sunrise PG',
    address: '45 Park Street, Cityville',
    city: 'Cityville',
    state: 'State',
    country: 'India',
    zip_code: '500002',
    contact_phone: '+91 91234 56789',
    contact_email: 'sunrise@pg.example',
    rooms: 18,
    floors: 2,
    business_hours: '09:00 - 21:00',
    hostel_type: 'pg',
    food_provided: false,
    gst_number: '',
    fssai_license: '',
  },
]

const blankForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  contact_phone: '',
  contact_email: '',
  rooms: '',
  floors: '',
  business_hours: '',
  hostel_type: '',
  food_provided: false,
  gst_number: '',
  fssai_license: '',
}

// Modal Component with smooth animations
const Modal = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-linear-to-r from-blue-600 to-blue-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// Hostel Card Component
const HostelCard = ({ hostel, onEdit, onDelete, isSelected, onSelect }) => {
  const typeLabels = {
    hostel: 'Hostel',
    pg: 'Paying Guest',
    dormitory: 'Dormitory',
  }

  return (
    <div 
      className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(hostel.id)}
    >
      {/* Card Header with gradient */}
      <div className={`px-5 py-4 ${isSelected ? 'bg-linear-to-r from-blue-600 to-blue-700' : 'bg-linear-to-r from-blue-500 to-blue-600'}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{hostel.name}</h3>
              {isSelected && (
                <span className="px-2 py-0.5 text-xs font-medium bg-white/30 text-white rounded-full">
                  Active
                </span>
              )}
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
              {typeLabels[hostel.hostel_type] || 'Unknown Type'}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(hostel); }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Edit hostel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(hostel.id); }}
              className="p-2 text-white/80 hover:text-white hover:bg-red-500/50 rounded-lg transition-colors"
              title="Delete hostel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <div>{hostel.address}</div>
            <div>{hostel.city}, {hostel.state} {hostel.zip_code}</div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="text-sm text-gray-600">{hostel.contact_phone || '—'}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm text-gray-600">{hostel.rooms || 0} Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-sm text-gray-600">{hostel.floors || 0} Floors</span>
          </div>
          {hostel.food_provided && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-600">Food</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Form Component for Add/Edit
const HostelForm = ({ form, setForm, errors, onSubmit, onCancel, isEditing }) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-5">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Enter hostel name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Type</label>
            <select
              value={form.hostel_type}
              onChange={(e) => setForm((f) => ({ ...f, hostel_type: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select type</option>
              <option value="hostel">Hostel</option>
              <option value="pg">Paying Guest (PG)</option>
              <option value="dormitory">Dormitory</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
          Address
        </h3>
        <div className="space-y-4 pl-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Enter street address"
            />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                placeholder="City"
              />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                value={form.zip_code}
                onChange={(e) => setForm((f) => ({ ...f, zip_code: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ZIP"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Facilities Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">3</span>
          Contact & Facilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              value={form.contact_phone}
              onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="hostel@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
            <input
              type="number"
              min="0"
              value={form.rooms}
              onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
            <input
              type="number"
              min="0"
              value={form.floors}
              onChange={(e) => setForm((f) => ({ ...f, floors: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
            <input
              value={form.business_hours}
              onChange={(e) => setForm((f) => ({ ...f, business_hours: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="09:00 - 21:00"
            />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.food_provided}
                onChange={(e) => setForm((f) => ({ ...f, food_provided: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Food Provided</span>
            </label>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">4</span>
          Compliance (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input
              value={form.gst_number}
              onChange={(e) => setForm((f) => ({ ...f, gst_number: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="GSTXXXXXXXXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License</label>
            <input
              value={form.fssai_license}
              onChange={(e) => setForm((f) => ({ ...f, fssai_license: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="FSSAI License Number"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {isEditing ? 'Save Changes' : 'Add Hostel'}
        </button>
      </div>
    </form>
  )
}

const HostelDetails = () => {
  const [hostels, setHostels] = useState([])
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHostel, setEditingHostel] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)

  // Load hostels on mount
  useEffect(() => {
    const loadHostelsData = async () => {
      try {
        // TODO: Replace with API call when backend is ready
        // const data = await FETCH_HOSTELS()
        // setHostels(data)
        setHostels(sampleHostels)
        // Select first hostel by default
        if (sampleHostels.length > 0) {
          setSelectedHostelId(sampleHostels[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch hostels:', error)
      } finally {
        setLoading(false)
      }
    }
    loadHostelsData()
  }, [])

  // Get the currently selected hostel
  const selectedHostel = hostels.find(h => h.id === selectedHostelId) || null

  // Open modal for creating new hostel
  const handleAddNew = () => {
    setForm(blankForm)
    setEditingHostel(null)
    setErrors({})
    setIsModalOpen(true)
  }

  // Open modal for editing hostel
  const handleEdit = (hostel) => {
    setForm({
      name: hostel.name || '',
      address: hostel.address || '',
      city: hostel.city || '',
      state: hostel.state || '',
      country: hostel.country || '',
      zip_code: hostel.zip_code || '',
      contact_phone: hostel.contact_phone || '',
      contact_email: hostel.contact_email || '',
      rooms: hostel.rooms || '',
      floors: hostel.floors || '',
      business_hours: hostel.business_hours || '',
      hostel_type: hostel.hostel_type || '',
      food_provided: hostel.food_provided || false,
      gst_number: hostel.gst_number || '',
      fssai_license: hostel.fssai_license || '',
    })
    setEditingHostel(hostel)
    setErrors({})
    setIsModalOpen(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingHostel(null)
    setErrors({})
  }

  // Validate form
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Hostel name is required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    return e
  }

  // Handle save (create or update)
  const handleSave = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    if (editingHostel) {
      // Update existing hostel
      setHostels((prev) =>
        prev.map((h) =>
          h.id === editingHostel.id
            ? { ...h, ...form, rooms: form.rooms ? Number(form.rooms) : 0, floors: form.floors ? Number(form.floors) : 0 }
            : h
        )
      )
      showMessage('Hostel updated successfully!', 'success')
    } else {
      // Create new hostel
      const id = `h_${Date.now().toString(36)}`
      const newHostel = {
        id,
        ...form,
        rooms: form.rooms ? Number(form.rooms) : 0,
        floors: form.floors ? Number(form.floors) : 0,
      }
      setHostels((prev) => [newHostel, ...prev])
      setSelectedHostelId(id) // Select the newly created hostel
      showMessage('Hostel added successfully!', 'success')
    }

    handleCloseModal()
  }

  // Handle delete
  const handleDelete = (hostelId) => {
    if (!confirm('Are you sure you want to delete this hostel?')) return
    
    const updatedHostels = hostels.filter((h) => h.id !== hostelId)
    setHostels(updatedHostels)
    
    // If deleted hostel was selected, select first remaining hostel
    if (hostelId === selectedHostelId && updatedHostels.length > 0) {
      setSelectedHostelId(updatedHostels[0].id)
    } else if (updatedHostels.length === 0) {
      setSelectedHostelId(null)
    }
    
    showMessage('Hostel deleted.', 'info')
  }

  // Show message with auto-dismiss
  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading hostels...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Hostel Switcher */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Current Hostel</label>
              <select
                value={selectedHostelId || ''}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800 min-w-[200px]"
              >
                {hostels.length === 0 && <option value="">No hostels available</option>}
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedHostel && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedHostel.city}, {selectedHostel.state}
              </div>
            )}
          </div>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Hostel
          </button>
        </div>
      </div>

      {/* Success/Info Message */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          {message.text}
        </div>
      )}

      {/* Hostels Grid */}
      {hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hostels.map((hostel) => (
            <HostelCard
              key={hostel.id}
              hostel={hostel}
              isSelected={hostel.id === selectedHostelId}
              onSelect={setSelectedHostelId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No hostels yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first hostel property</p>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Hostel
          </button>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
      >
        <HostelForm
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          isEditing={!!editingHostel}
        />
      </Modal>
    </div>
  )
}

export default HostelDetails
