import { useState, useEffect } from 'react'
import { FETCH_HOSTELS } from '../Data/request.js'

/**
 * HostelSidebar - A sidebar component for selecting hostels
 * Used in Rooms, Bookings, and Complaints pages
 * 
 * Props:
 * - selectedHostelId: currently selected hostel ID
 * - onSelectHostel: callback when hostel is selected
 * - title: page title (e.g., "Rooms", "Bookings")
 * - children: the main content to display
 */
const HostelSidebar = ({ selectedHostelId, onSelectHostel, onHostelData, title, subtitle, children }) => {
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const loadHostels = async () => {
      try {
        setError(null)
        const data = await FETCH_HOSTELS()
        setHostels(data)
        // Auto-select first hostel if none selected
        if (data.length > 0 && !selectedHostelId) {
          onSelectHostel(data[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch hostels:', err)
        setError('Failed to load hostels')
      } finally {
        setLoading(false)
      }
    }
    loadHostels()
  }, [])

  const selectedHostel = hostels.find(h => h.id === selectedHostelId)

  // Pass selected hostel data to parent when it changes
  useEffect(() => {
    if (onHostelData) {
      onHostelData(selectedHostel || null)
    }
  }, [selectedHostel, onHostelData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">{error}</div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Retry
        </button>
      </div>
    )
  }

  if (hostels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">No hostels found</h3>
        <p className="text-gray-500">Please add a hostel in Settings first.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} shrink-0`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="font-semibold text-gray-800">Hostels</h2>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {hostels.map((hostel) => (
            <button
              key={hostel.id}
              onClick={() => onSelectHostel(hostel.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                hostel.id === selectedHostelId
                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              title={hostel.name}
            >
              {sidebarCollapsed ? (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mx-auto">
                  {hostel.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <>
                  <div className="font-medium truncate">{hostel.name}</div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {hostel.city}{hostel.state ? `, ${hostel.state}` : ''}
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {selectedHostel && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {selectedHostel.name}
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default HostelSidebar
