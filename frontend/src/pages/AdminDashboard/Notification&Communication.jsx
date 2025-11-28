import React, { useState, useMemo } from 'react'
import { Bell, Mail, AlertCircle, CheckCircle, Clock, Trash2, Archive } from 'lucide-react'

const NotificationAndCommunication = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Received',
      message: 'Aman Singh has booked Room 101 (Floor 1) for 4 nights starting 2025-11-01',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      icon: 'booking',
    },
    {
      id: 2,
      type: 'complaint',
      title: 'New Complaint Filed',
      message: 'Priya Sharma filed a complaint: "WiFi is not working in room 202"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
      icon: 'alert',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹2,500 received for booking B-002. Transaction ID: PAY_def456',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: 'check',
    },
    {
      id: 4,
      type: 'booking',
      title: 'Check-in Reminder',
      message: 'Ravi Kumar is checking in today to Room 102 (Floor 1)',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: 'clock',
    },
    {
      id: 5,
      type: 'maintenance',
      title: 'Maintenance Alert',
      message: 'Room 305 reported water leakage. Maintenance team notified.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: 'alert',
    },
    {
      id: 6,
      type: 'guest',
      title: 'Guest Check-out',
      message: 'Guest from Room 201 checked out. Room is ready for cleaning.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: 'check',
    },
  ])

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = notifications

    if (filter !== 'all') {
      result = result.filter((n) => {
        if (filter === 'unread') return !n.read
        if (filter === 'read') return n.read
        return n.type === filter
      })
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
      )
    }

    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [notifications, filter, search])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const archiveNotification = (id) => {
    // Could store in separate archived state if needed
    deleteNotification(id)
  }

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'booking':
        return <Bell className="w-5 h-5 text-blue-600" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'check':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'clock':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Mail className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-50 border-blue-200'
      case 'complaint':
        return 'bg-red-50 border-red-200'
      case 'payment':
        return 'bg-green-50 border-green-200'
      case 'maintenance':
        return 'bg-orange-50 border-orange-200'
      case 'guest':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now - time

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return time.toLocaleDateString()
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your notifications and communications.</p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              Mark all as read
            </button>
          )}
        </header>

        {/* Stats */}
        {notifications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-600 text-sm">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-600 text-sm">Unread</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{unreadCount}</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-600 text-sm">Read</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {notifications.length - unreadCount}
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-600 text-sm">Today</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {
                  notifications.filter((n) => {
                    const today = new Date()
                    const notifDate = new Date(n.timestamp)
                    return (
                      today.toDateString() === notifDate.toDateString()
                    )
                  }).length
                }
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('booking')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'booking'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setFilter('complaint')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'complaint'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              Complaints
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-lg p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search ? 'Try adjusting your search' : 'All caught up!'}
              </p>
            </div>
          ) : (
            filtered.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-all ${
                  notification.read
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200 shadow-md'
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="shrink-0 pt-1">
                    {getIcon(notification.icon)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium capitalize">
                            {notification.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      {!notification.read && (
                        <div className="shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4 text-gray-400 hover:text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => archiveNotification(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationAndCommunication
