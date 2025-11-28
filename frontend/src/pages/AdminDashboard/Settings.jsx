import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'

const BASE_PATH = '/adminDashboard/settings'

const TABS = [
  { id: 'hostelDetails', label: 'Hostel Profile', desc: 'Edit name, address and contact details', path: '/hostelDetails' },
  { id: 'owners', label: 'Users & Roles', desc: 'Manage co-admins, roles and permissions', path: '/owners' },
  { id: 'notificationAndCommunication', label: 'Notification & Communication', desc: 'Email/SMS templates & channels', path: '/notificationAndCommunication' },
  { id: 'securityAndAccess', label: 'Security & Access', desc: '2FA, password policy and session timeout', path: '/securityAndAccess' },
]

const Settings = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isBase = location.pathname === BASE_PATH || location.pathname === `${BASE_PATH}/`

  if (!isBase) {
    // child view: hide base list, show back arrow + Outlet for child routes
    return (
      <div className="min-h-0 p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(BASE_PATH)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-100"
              aria-label="Back to settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    )
  }

  // base list view: linear list of full-row links
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a settings area to configure.</p>
        </header>

        <nav className="flex flex-col gap-3" aria-label="Settings">
          {TABS.map((t) => (
            <Link
              key={t.id}
              to={`${BASE_PATH}${t.path}`}
              className="group bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="text-left">
                <div className="text-lg font-medium text-gray-900 group-hover:text-blue-600">{t.label}</div>
                <div className="text-sm text-gray-500 mt-1">{t.desc}</div>
              </div>

              <div className="ml-4 text-gray-400 group-hover:text-blue-500" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Settings
