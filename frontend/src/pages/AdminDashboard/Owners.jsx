import { useEffect, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import UserCard from '../../components/UserCard.jsx'
import { FETCH_CO_ADMINS, CREATE_CO_ADMIN, DELETE_CO_ADMIN, UPDATE_CO_ADMIN } from '../../Data/request.js'

const blankForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

// Owner Form Component
const OwnerForm = ({ form, setForm, errors, onSubmit, onCancel, isEditing = false, isLoading = false }) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-5">
      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="First name"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Last name"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
          Account Details
        </h3>
        <div className="space-y-4 pl-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {!isEditing && <span className="text-red-500">*</span>}
                {isEditing && <span className="text-gray-400 text-xs ml-1">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                placeholder={isEditing ? 'Enter new password' : '••••••••'}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password {!isEditing && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                placeholder={isEditing ? 'Confirm new password' : '••••••••'}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isEditing ? 'Save Changes' : 'Create Owner'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

const Owners = () => {
  const [owners, setOwners] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOwner, setEditingOwner] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  // Load co-admins from API
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setIsFetching(true)
        const data = await FETCH_CO_ADMINS()
        // Map backend field names to frontend field names
        const mapped = data.map(o => ({
          id: o.id,
          firstName: o.first_name,
          lastName: o.last_name,
          email: o.email,
          createdAt: o.created_at,
        }))
        setOwners(mapped)
      } catch (err) {
        console.error('Failed to fetch co-admins:', err)
        showMessage('Failed to load co-admins', 'error')
      } finally {
        setIsFetching(false)
      }
    }
    fetchOwners()
  }, [])

  const handleAddNew = () => {
    setForm(blankForm)
    setEditingOwner(null)
    setErrors({})
    setIsModalOpen(true)
  }

  const handleEdit = (owner) => {
    setForm({
      firstName: owner.firstName || '',
      lastName: owner.lastName || '',
      email: owner.email || '',
      password: '',
      confirmPassword: '',
    })
    setEditingOwner(owner)
    setErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOwner(null)
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    
    if (!editingOwner) {
      // Password required for new owners
      if (!form.password) e.password = 'Password is required'
      else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    } else {
      // Password optional for editing, but validate if provided
      if (form.password) {
        if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
      }
    }
    return e
  }

  const handleSave = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setIsLoading(true)

    try {
      if (editingOwner) {
        // Update existing co-admin
        const updateData = {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
        }
        // Only include password if provided
        if (form.password) {
          updateData.password = form.password
        }
        
        const updated = await UPDATE_CO_ADMIN(editingOwner.id, updateData)
        
        setOwners(prev => prev.map(o => 
          o.id === editingOwner.id 
            ? {
                id: updated.id,
                firstName: updated.first_name,
                lastName: updated.last_name,
                email: updated.email,
                createdAt: updated.created_at,
              }
            : o
        ))
        showMessage('Co-admin updated successfully!', 'success')
      } else {
        // Create new co-admin
        const createData = {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          confirm_password: form.confirmPassword,
        }
        
        const created = await CREATE_CO_ADMIN(createData)
        
        // Refresh the list to get accurate data
        const data = await FETCH_CO_ADMINS()
        const mapped = data.map(o => ({
          id: o.id,
          firstName: o.first_name,
          lastName: o.last_name,
          email: o.email,
          createdAt: o.created_at,
        }))
        setOwners(mapped)
        showMessage('Co-admin created successfully!', 'success')
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save co-admin:', err)
      const errorMsg = err.response?.data?.email?.[0] || 
                       err.response?.data?.error || 
                       err.response?.data?.detail ||
                       'Failed to save co-admin. Please try again.'
      setErrors({ email: errorMsg })
      showMessage(errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this co-admin?')) return
    
    try {
      await DELETE_CO_ADMIN(id)
      setOwners(prev => prev.filter(o => o.id !== id))
      showMessage('Co-admin removed.', 'info')
    } catch (err) {
      console.error('Failed to delete co-admin:', err)
      showMessage('Failed to remove co-admin', 'error')
    }
  }

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading co-admins...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Co-Owners & Admins</h1>
          <p className="text-gray-500 mt-1">Manage people who can access and manage your hostel</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Owner
        </button>
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

      {/* Owners Grid */}
      {owners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {owners.map((owner) => (
            <UserCard
              key={owner.id}
              user={owner}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No co-owners yet</h3>
          <p className="text-gray-500 mb-6">Add co-owners to help manage your hostel</p>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Co-Owner
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingOwner ? 'Edit Owner' : 'Add New Owner'}>
        <OwnerForm
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          isEditing={!!editingOwner}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  )
}

export default Owners