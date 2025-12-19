import { useEffect, useState } from 'react'
import { FETCH_HOSTELS, CREATE_HOSTEL, EDIT_HOSTEL, DELETE_HOSTEL } from '../../Data/request.js'
import Modal from '../../components/Modal.jsx'
import HostelCard from '../../components/HostelCard.jsx'
import HostelForm from '../../components/HostelForm.jsx'
import { usePermissions } from '../../context/PermissionsContext.jsx'

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

const HostelDetails = () => {
  const [hostels, setHostels] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHostel, setEditingHostel] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const { isAdmin } = usePermissions()

  useEffect(() => {
    const loadHostelsData = async () => {
      try {
        setError(null)
        const data = await FETCH_HOSTELS()
        setHostels(data)
      } catch (err) {
        console.error('Failed to fetch hostels:', err)
        setError('Failed to load hostels. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadHostelsData()
  }, [])

  const handleAddNew = () => {
    setForm(blankForm)
    setEditingHostel(null)
    setErrors({})
    setIsModalOpen(true)
  }

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

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingHostel(null)
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Hostel name is required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    return e
  }

  const handleSave = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setIsSaving(true)
    
    try {
      const hostelData = {
        ...form,
        rooms: form.rooms ? Number(form.rooms) : 0,
        floors: form.floors ? Number(form.floors) : 0,
      }

      if (editingHostel) {
        // Update existing hostel via API
        const updatedHostel = await EDIT_HOSTEL(editingHostel.id, hostelData)
        setHostels((prev) =>
          prev.map((h) => (h.id === editingHostel.id ? updatedHostel : h))
        )
        showMessage('Hostel updated successfully!', 'success')
      } else {
        // Create new hostel via API
        const newHostel = await CREATE_HOSTEL(hostelData)
        setHostels((prev) => [newHostel, ...prev])
        showMessage('Hostel added successfully!', 'success')
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save hostel:', err)
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Failed to save hostel. Please try again.'
      showMessage(errorMsg, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (hostelId) => {
    if (!confirm('Are you sure you want to delete this hostel?')) return
    
    try {
      await DELETE_HOSTEL(hostelId)
      setHostels(prev => prev.filter(h => h.id !== hostelId))
      showMessage('Hostel deleted.', 'info')
    } catch (err) {
      console.error('Failed to delete hostel:', err)
      const errorMsg = err.response?.data?.detail || 'Failed to delete hostel. Please try again.'
      showMessage(errorMsg, 'error')
    }
  }

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Hostels</h2>
            <p className="text-sm text-gray-500 mt-1">Add, edit, or remove your hostel properties</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Hostel
            </button>
          )}
        </div>
      </div>

      {/* Message */}
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
              onEdit={isAdmin ? handleEdit : null}
              onDelete={isAdmin ? handleDelete : null}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No hostels yet</h3>
          <p className="text-gray-500 mb-6">
            {!isAdmin ? 'No hostels assigned to you yet' : 'Get started by adding your first hostel property'}
          </p>
          {isAdmin && (
            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Hostel
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingHostel ? 'Edit Hostel' : 'Add New Hostel'}>
        <HostelForm form={form} setForm={setForm} errors={errors} onSubmit={handleSave} onCancel={handleCloseModal} isEditing={!!editingHostel} isLoading={isSaving} />
      </Modal>
    </div>
  )
}

export default HostelDetails