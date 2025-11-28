import React from 'react'

const MainDashboard = () => {
  return (
    <div className="min-h-screen w-full p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-5 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Rooms</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">120</p>
              </div>
              <div className="text-blue-600 bg-blue-50 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Total rooms listed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Occupied</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">85</p>
              </div>
              <div className="text-green-600 bg-green-50 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Currently occupied rooms</p>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Available</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">35</p>
              </div>
              <div className="text-amber-600 bg-amber-50 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Ready to book</p>
          </div>
        </div>

        {/* Middle panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-5 border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Check-In Today</h4>
                <p className="mt-2 text-xl font-semibold text-gray-900">12</p>
                <p className="mt-1 text-xs text-gray-500">Expected arrivals</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View</button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Manage</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5 border">
              <h4 className="text-sm font-medium text-gray-500">Check-Out Today</h4>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Scheduled</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">8</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Late checkouts</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-5 border">
              <h4 className="text-sm font-medium text-gray-500">Complaints</h4>
              <p className="mt-2 text-2xl font-semibold text-red-600">3</p>
              <p className="mt-1 text-xs text-gray-500">Pending responses</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border">
              <h4 className="text-sm font-medium text-gray-500">Quick Actions</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">New Booking</button>
                <button className="px-3 py-2 bg-emerald-600 text-white rounded text-sm">Add Room</button>
                <button className="px-3 py-2 border rounded text-sm">Export</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-5 border">
            <h4 className="text-sm font-medium text-gray-500">Recent Bookings</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Aman — Room 101</p>
                  <p className="text-xs text-gray-500">Check-in: Today, 2:00 PM</p>
                </div>
                <span className="text-xs text-green-600">Confirmed</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Priya — Room 202</p>
                  <p className="text-xs text-gray-500">Check-in: Tomorrow</p>
                </div>
                <span className="text-xs text-amber-600">Pending</span>
              </li>
            </ul>
            <div className="mt-4">
              <button className="text-sm text-blue-600 hover:underline">View all bookings</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border">
            <h4 className="text-sm font-medium text-gray-500">Quick Links</h4>
            <div className="mt-3 grid gap-2">
              <button className="text-left px-3 py-2 rounded hover:bg-gray-50">Manage Rooms</button>
              <button className="text-left px-3 py-2 rounded hover:bg-gray-50">Payments & Payouts</button>
              <button className="text-left px-3 py-2 rounded hover:bg-gray-50">Maintenance Requests</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border">
            <h4 className="text-sm font-medium text-gray-500">Top Alerts</h4>
            <ul className="mt-3 space-y-3">
              <li className="text-sm text-red-600">Power outage scheduled at 11:00 PM</li>
              <li className="text-sm text-amber-600">Low housekeeping staff for weekend</li>
              <li className="text-sm text-gray-700">Monthly report ready</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MainDashboard
