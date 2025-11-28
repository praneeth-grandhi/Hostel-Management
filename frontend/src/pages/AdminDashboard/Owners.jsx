import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'hostelManagement:owners'

function loadOwners() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveOwners(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

const Owners = () => {
  const [owners, setOwners] = useState([])
  const [showForm, setShowForm] = useState(false)

  // combined form object
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isSuper: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const existing = loadOwners()
    setOwners(Array.isArray(existing) ? existing : [])
  }, [])

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    setSuccess(false)

    setTimeout(() => {
      const all = loadOwners()
      const exists = all.find((a) => a.email.toLowerCase() === form.email.toLowerCase())
      if (exists) {
        setErrors({ email: 'An owner with this email already exists' })
        setLoading(false)
        return
      }

      const id = `owner_${Date.now().toString(36)}`
      const record = {
        id,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: btoa(form.password), // demo only — do not store plaintext in production
        role: form.isSuper ? 'superowner' : 'owner',
        createdAt: new Date().toISOString(),
      }
      all.unshift(record)
      saveOwners(all)
      setOwners(all)

      setLoading(false)
      setSuccess(true)
      setForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', isSuper: false })
      setErrors({})
      setShowForm(false)
    }, 600)
  }

  const handleDelete = (id) => {
    if (!confirm('Remove this owner?')) return
    const updated = owners.filter((a) => a.id !== id)
    saveOwners(updated)
    setOwners(updated)
  }

  const initials = (firstName, lastName) =>
    `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase()

  return (
    <div className="min-h-150 p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Owners</h1>
            <p className="text-sm text-gray-500">People who can manage this hostel (co-owners / co-admins).</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm((s) => !s)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              {showForm ? 'Close Form' : 'Create New Owner'}
            </button>
          </div>
        </header>

        <section className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            {owners.length === 0 ? (
              <div className="text-sm text-gray-500">No owners yet.</div>
            ) : (
              owners.map((a) => (
                <div key={a.id} className="flex items-center gap-3 bg-gray-50 border rounded p-3 min-w-[220px]">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    {initials(a.firstName, a.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{a.firstName} {a.lastName}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                    <div className="text-xs mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${a.role === 'superowner' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                        {a.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleDelete(a.id)} className="px-2 py-1 border rounded text-sm text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {showForm && (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Create Owner Account</h2>
            <p className="text-sm text-gray-500 mb-4">Create another owner user. Fields match the public register form (name, email, password).</p>

            {success && <div className="mb-4 p-3 text-sm text-green-800 bg-green-100 rounded">Owner account created.</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-600">First Name</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className={`mt-1 w-full px-3 py-2 border rounded ${errors.firstName ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">Last Name</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className={`mt-1 w-full px-3 py-2 border rounded ${errors.lastName ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-gray-600">Email</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={`mt-1 w-full px-3 py-2 border rounded ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-600">Password</span>
                  <input
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    type="password"
                    className={`mt-1 w-full px-3 py-2 border rounded ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">Confirm Password</span>
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    type="password"
                    className={`mt-1 w-full px-3 py-2 border rounded ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </label>
              </div>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isSuper}
                  onChange={(e) => setForm((f) => ({ ...f, isSuper: e.target.checked }))}
                />
                <span className="text-sm text-gray-600">Give super-owner privileges</span>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: '', password: '', confirmPassword: '', isSuper: false })
                    setErrors({})
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Reset
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {loading ? 'Creating...' : 'Create Owner'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Owners