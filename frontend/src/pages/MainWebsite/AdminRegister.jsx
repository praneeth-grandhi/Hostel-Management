import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'

const AdminRegister = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [secondaryPhone, setSecondaryPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // files / documents
  const [profilePicture, setProfilePicture] = useState(null) // File
  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const [aadhar, setAadhar] = useState('') // number (optional)
  const [aadharFile, setAadharFile] = useState(null)
  const [pan, setPan] = useState('')
  const [panFile, setPanFile] = useState(null)
  const [gst, setGst] = useState('')
  const [FSSAI, setFSSAI] = useState('')
  const [proofOfAddressDocument, setProofOfAddressDocument] = useState(null) // File

  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  // new states for OTP + post-registration branching
  const [step, setStep] = useState('form') // 'form' | 'otp' | 'post'
  const [otp, setOtp] = useState('')
  const [postTab, setPostTab] = useState('join') // 'join' | 'register'

  // small demo data for join-existing-hostel flow
  const demoHostels = [
    { id: 1, name: 'Green Valley Hostel', area: 'MG Road' },
    { id: 2, name: 'Sunrise PG', area: 'Park Street' },
    { id: 3, name: 'Campus Stay', area: 'Near College' },
  ]
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHostel, setSelectedHostel] = useState(null)
  // show only a single pending request summary (don't keep appending list items)
  const [pendingRequest, setPendingRequest] = useState(null)
  const [registrations, setRegistrations] = useState([])

  const passwordStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    return score // 0..4
  }

  const validate = () => {
    const e = {}
    if (!firstName.trim()) e.firstName = 'First name is required'
    if (!lastName.trim()) e.lastName = 'Last name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!phone.trim()) e.phone = 'Mobile phone is required'
    else if (!/^[0-9]{7,15}$/.test(phone.replace(/\D/g, ''))) e.phone = 'Enter a valid phone number'
    if (!countryCode.trim()) e.countryCode = 'Country code is required'
    if (!address.trim()) e.address = 'Address is required'
    if (!country.trim()) e.country = 'Country is required'
    if (!city.trim()) e.city = 'City is required'
    if (!state.trim()) e.state = 'State is required'
    if (!zipCode.trim()) e.zipCode = 'Zip code is required'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!agree) e.agree = 'You must accept Terms & Privacy'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    // simulate creating account and sending OTP
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setStep('otp') // move to OTP step
      // in real flow: send OTP to phone/email here
    }, 900)
  }

  const handleVerifyOtp = (ev) => {
    ev.preventDefault()
    // for now accept any value - treat as verified
    setStep('post')
  }

  // Join existing hostel handlers
  const filteredHostels = demoHostels.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.area.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const requestAccess = () => {
    if (!selectedHostel) return
    // store only the current pending request (show it once)
    setPendingRequest({ hostel: selectedHostel, status: 'pending', requestedAt: new Date().toISOString() })
    setSelectedHostel(null)
    setSearchQuery('')
  }

  // Register new hostel handler (minimal)
  const [hostelName, setHostelName] = useState('')
  const [hostelAddress, setHostelAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [hostelType, setHostelType] = useState('hostel')
  const [totalRooms, setTotalRooms] = useState('')
  const [floors, setFloors] = useState('')
  const [businessHours, setBusinessHours] = useState('')

  // validation state for hostel registration
  const [hostelErrors, setHostelErrors] = useState([])

  const submitHostelRegistration = (ev) => {
    ev.preventDefault()
    // validate required fields and list any missing ones
    const missing = []
    if (!hostelName.trim()) missing.push('Hostel name')
    if (!hostelAddress.trim()) missing.push('Address')

    if (missing.length) {
      // surface the missing fields so user can fix them
      setHostelErrors(missing)
      return
    }

    setHostelErrors([])
    const id = registrations.length + 1
    setRegistrations((r) => [
      ...r,
      {
        id,
        name: hostelName,
        address: hostelAddress,
        contactPhone: contactPhone,
        type: hostelType,
        totalRooms: totalRooms,
        floors: floors,
        businessHours,
        status: 'pending',
      },
    ])
    setHostelName('')
    setHostelAddress('')
    setContactPhone('')
    setHostelType('hostel')
    setTotalRooms('')
    setFloors('')
    setBusinessHours('')
  }

  // file handlers
  useEffect(() => {
    // cleanup preview URL on unmount/change
    return () => {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProfilePictureChange = (file) => {
    if (!file) {
      setProfilePicture(null)
      setProfilePicturePreview('')
      return
    }
    setProfilePicture(file)
    const url = URL.createObjectURL(file)
    setProfilePicturePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  const handleFileSet = (setterFile) => (file) => {
    setterFile(file || null)
  }

  return (
    <div className="container mx-auto p-6">
      {/* FORM STEP */}
      {step === 'form' && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Admin / Owner Account</h1>
            <p className="text-sm text-gray-600 mb-6">
              Minimal first-step registration. We will request hostel documents later if you register a hostel.
            </p>

            {success && (
              <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 text-sm">
                Account created (demo). Next: phone OTP verification.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First name *</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.firstName ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last name *</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.lastName ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder={'owner@example.com'}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile phone *</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.phone ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country code *</label>
                  <input
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    type="text"
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.countryCode ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="+91"
                  />
                  {errors.countryCode && <p className="mt-1 text-xs text-red-600">{errors.countryCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Secondary phone (optional)</label>
                  <input
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    type="tel"
                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                    placeholder="Alternate phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Display name (optional)</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                  placeholder="Name shown to guests"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Short bio (optional)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                  placeholder="A short line about yourself"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.address ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.country ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="United States"
                />
                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
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
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
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
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.zipCode ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="10001"
                  />
                  {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
                </div>
              </div>

              {/* Profile picture upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile picture (optional)</label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfilePictureChange(e.target.files?.[0])}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-700">Upload</span>
                  </label>

                  {profilePicturePreview ? (
                    <img src={profilePicturePreview} alt="preview" className="w-16 h-16 rounded-md object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-50 border flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null)
                        if (profilePicturePreview) {
                          URL.revokeObjectURL(profilePicturePreview)
                          setProfilePicturePreview('')
                        }
                      }}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Identity documents (optional fields) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aadhaar number</label>
                  <input value={aadhar} onChange={(e) => setAadhar(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg" placeholder="XXXX-XXXX-XXXX" />
                  <label className="mt-2 inline-flex items-center gap-3 px-3 py-2 bg-gray-100 rounded cursor-pointer">
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setAadharFile(e.target.files?.[0] || null)} />
                    <span className="text-sm text-gray-700">Upload Aadhaar</span>
                  </label>
                  {aadharFile && <p className="text-xs mt-1 text-gray-600">{aadharFile.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">PAN</label>
                  <input value={pan} onChange={(e) => setPan(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg" placeholder="AAAAA9999A" />
                  <label className="mt-2 inline-flex items-center gap-3 px-3 py-2 bg-gray-100 rounded cursor-pointer">
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setPanFile(e.target.files?.[0] || null)} />
                    <span className="text-sm text-gray-700">Upload PAN</span>
                  </label>
                  {panFile && <p className="text-xs mt-1 text-gray-600">{panFile.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="At least 8 characters"
                  />
                  <div className="mt-2 h-2 w-full bg-gray-100 rounded">
                    <div
                      className={`h-2 rounded ${{
                        0: 'w-0 bg-red-400',
                        1: 'w-1/4 bg-red-400',
                        2: 'w-2/4 bg-yellow-400',
                        3: 'w-3/4 bg-green-400',
                        4: 'w-full bg-green-600',
                      }[passwordStrength(password)]}`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Use a mix of letters, numbers and symbols.</p>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm password *</label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I'm registering as an admin/owner and agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> &{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> *
                </label>
              </div>
              {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white font-medium ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Registering...' : 'Create account'}
                </button>
              </div>

              <div className="text-sm text-center text-gray-600">
                Already registered?{' '}
                <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP STEP */}
      {step === 'otp' && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Verify phone (OTP)</h2>
          <p className="text-sm text-gray-600 mb-4">Enter the OTP sent to {phone || 'your mobile'}. (demo accepts any value)</p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter OTP"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg">Verify</button>
              <button
                type="button"
                onClick={() => {
                  setOtp('')
                  // simulate resend
                }}
                className="py-3 px-4 border rounded-lg"
              >
                Resend
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POST-REGISTRATION: join existing OR register new hostel */}
      {step === 'post' && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-6">
            <h2 className="text-2xl font-semibold mb-4">Next step — Join or Register Hostel</h2>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setPostTab('join')}
                className={`px-4 py-2 rounded-md ${postTab === 'join' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Join Existing Hostel
              </button>
              <button
                onClick={() => setPostTab('register')}
                className={`px-4 py-2 rounded-md ${postTab === 'register' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Register New Hostel
              </button>
            </div>

            {postTab === 'join' && (
              <div className="space-y-4">
                <label className="block">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hostels by name or area"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </label>

                <div className="grid gap-2">
                  {filteredHostels.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setSelectedHostel(h)}
                      className={`text-left p-3 rounded-lg border ${selectedHostel?.id === h.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="font-medium">{h.name}</div>
                      <div className="text-sm text-gray-500">{h.area}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={requestAccess}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    disabled={!selectedHostel}
                  >
                    Request Access
                  </button>
                  <button onClick={() => { setSelectedHostel(null); setSearchQuery('') }} className="px-4 py-2 border rounded-lg">Clear</button>
                </div>

                {pendingRequest && (
                  <div className="mt-4 p-4 rounded-md bg-yellow-50 border border-yellow-100">
                    <h3 className="font-medium mb-1">Access request pending</h3>
                    <div className="text-sm text-gray-700">
                      You requested access to <span className="font-medium">{pendingRequest.hostel.name}</span> —{' '}
                      <span className="italic text-gray-500">{pendingRequest.status}</span>.
                    </div>
                  </div>
                )}
                {/* show hostel registration validation errors, if any */}
                {hostelErrors && hostelErrors.length > 0 && (
                  <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-700">
                    Please provide: {hostelErrors.join(', ')}.
                  </div>
                )}
              </div>
            )}

            {postTab === 'register' && (
              <form onSubmit={submitHostelRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Hostel name *</label>
                  <input value={hostelName} onChange={(e) => setHostelName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Address *</label>
                  <input value={hostelAddress} onChange={(e) => setHostelAddress(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">Contact phone</label>
                    <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">Type</label>
                    <select value={hostelType} onChange={(e) => setHostelType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                      <option value="hostel">Hostel</option>
                      <option value="pg">PG</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">Number of rooms</label>
                    <input type="number" min="0" value={totalRooms} onChange={(e) => setTotalRooms(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">Number of floors</label>
                    <input type="number" min="0" value={floors} onChange={(e) => setFloors(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">Business hours (optional)</label>
                    <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="e.g. 9:00 - 21:00" />
                  </div>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Proof of address/ownership</label>
                <p className='text-xs font-medium text-gray-700'>Documents accepted: (Rent Agreement + NOC) / Property tax receipt / Electricity bill / Water bill / Muncipal tax receipt</p>
                <label className="mt-2 inline-flex items-center gap-3 px-3 py-2 bg-gray-100 rounded cursor-pointer">
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setProofOfAddressDocument(e.target.files?.[0] || null)} />
                  <span className="text-sm text-gray-700">Upload supporting document</span>
                </label>
                {proofOfAddressDocument && <p className="text-xs mt-1 text-gray-600">{proofOfAddressDocument.name}</p>}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">GST / FSSAI (optional)</label>
                  <input value={gst} onChange={(e) => setGst(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg" placeholder="GST number" />
                  <input value={FSSAI} onChange={(e) => setFSSAI(e.target.value)} className="mt-2 block w-full px-4 py-2 border rounded-lg" placeholder="FSSAI number" />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Submit Registration</button>
                </div>

                {registrations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Registrations</h3>
                    <ul className="space-y-2">
                      {registrations.map((r) => (
                        <li key={r.id} className="text-sm text-gray-700">
                          {r.name} — <span className="italic text-gray-500">{r.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRegister
