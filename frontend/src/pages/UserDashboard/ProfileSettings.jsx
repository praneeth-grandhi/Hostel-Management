import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff, Trash2, Check, AlertCircle } from 'lucide-react'

const STORAGE_KEY = 'hostelManagement:userProfile'

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {}
}

const ProfileSettings = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '',
    address: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
    profilePicture: null,
    profilePicturePreview: '',
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'password', 'delete'
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  useEffect(() => {
    const saved = loadProfile()
    if (Object.keys(saved).length > 0) {
      setProfile(saved)
    }
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfile(prev => ({ ...prev, profilePicture: file }))
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfile(prev => ({ ...prev, profilePicturePreview: event.target?.result }))
    }
    reader.readAsDataURL(file)
  }

  const validateProfile = () => {
    const e = {}
    if (!profile.firstName.trim()) e.firstName = 'First name is required'
    if (!profile.lastName.trim()) e.lastName = 'Last name is required'
    if (!profile.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(profile.email)) e.email = 'Enter a valid email'
    if (!profile.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^[0-9]{7,15}$/.test(profile.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid phone number'
    if (!profile.countryCode.trim()) e.countryCode = 'Country code is required'
    if (!profile.address.trim()) e.address = 'Address is required'
    if (!profile.country.trim()) e.country = 'Country is required'
    if (!profile.city.trim()) e.city = 'City is required'
    if (!profile.state.trim()) e.state = 'State is required'
    if (!profile.zipCode.trim()) e.zipCode = 'Zip code is required'
    return e
  }

  const validatePassword = () => {
    const e = {}
    if (!passwords.currentPassword) e.currentPassword = 'Current password is required'
    if (!passwords.newPassword) e.newPassword = 'New password is required'
    else if (passwords.newPassword.length < 8) e.newPassword = 'Password must be at least 8 characters'
    if (passwords.newPassword !== passwords.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (passwords.newPassword === passwords.currentPassword) e.newPassword = 'New password must be different from current'
    return e
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const e_obj = validateProfile()
    setErrors(e_obj)
    if (Object.keys(e_obj).length) return

    setLoading(true)
    setTimeout(() => {
      saveProfile(profile)
      setLoading(false)
      setSuccess(true)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccess(false), 3000)
    }, 600)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    const e_obj = validatePassword()
    setErrors(e_obj)
    if (Object.keys(e_obj).length) return

    setLoading(true)
    // Demo: In real app, backend would verify current password
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setSuccessMessage('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(false), 3000)
    }, 600)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== 'DELETE') {
      setErrors({ confirm: 'Please type "DELETE" to confirm' })
      return
    }

    setLoading(true)
    setTimeout(() => {
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem('hostelManagement:auth')
        window.dispatchEvent(new Event('hostelAuthChange'))
      } catch {}
      setLoading(false)
      navigate('/')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and account security</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 text-center font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 text-center font-medium ${
                activeTab === 'password'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab('delete')}
              className={`flex-1 px-6 py-4 text-center font-medium ${
                activeTab === 'delete'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Delete Account
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800">{successMessage}</span>
              </div>
            )}

            {/* Personal Details Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Profile Picture */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profile.profilePicturePreview ? (
                        <img src={profile.profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-2xl">👤</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="px-4 py-2 border border-gray-200 rounded-lg cursor-pointer text-sm"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.firstName ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.lastName ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.phone ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country Code *</label>
                    <input
                      type="text"
                      name="countryCode"
                      value={profile.countryCode}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.countryCode ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="+1"
                    />
                    {errors.countryCode && <p className="mt-1 text-xs text-red-600">{errors.countryCode}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                      errors.address ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={profile.country}
                    onChange={handleProfileChange}
                    className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                      errors.country ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.city ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.state ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="NY"
                    />
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleProfileChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                        errors.zipCode ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    For security, you'll need to enter your current password to set a new one.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg pr-10 ${
                        errors.currentPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg pr-10 ${
                        errors.newPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg pr-10 ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                {/* Change Password Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Delete Account Tab */}
            {activeTab === 'delete' && (
              <div className="space-y-6 max-w-md">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <p className="text-sm text-red-700 mt-2">
                    Deleting your account is permanent and cannot be undone. All your data will be lost.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    To delete your account, type <span className="font-mono font-bold">DELETE</span> below:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => {
                      setDeleteConfirmation(e.target.value)
                      setErrors({})
                    }}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.confirm ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Type DELETE to confirm"
                  />
                  {errors.confirm && <p className="text-xs text-red-600">{errors.confirm}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmation !== 'DELETE'}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
