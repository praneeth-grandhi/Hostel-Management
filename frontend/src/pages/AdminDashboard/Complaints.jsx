import React, { useEffect, useMemo, useState } from 'react'
import { Check, MessageSquare, Reply } from 'lucide-react'
import HostelSidebar from '../../components/HostelSidebar'
import { FETCH_COMPLAINTS, UPDATE_COMPLAINT } from '../../Data/request'

const STATUS_CLASSES = {
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
}

const PAGE_SIZE = 8

const Complaints = () => {
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  // Response modal state
  const [respondingTo, setRespondingTo] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    if (!selectedHostelId) {
      setComplaints([])
      return
    }
    setLoading(true)
    try {
      const data = await FETCH_COMPLAINTS(selectedHostelId)
      setComplaints(data)
    } catch (err) {
      console.error('Failed to fetch complaints:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [selectedHostelId])

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (status && c.status !== status) return false
      if (query && !(`${c.user_name || ''} ${c.title} ${c.description}`.toLowerCase().includes(query.toLowerCase()))) return false
      if (from && new Date(c.created_at) < new Date(from)) return false
      if (to && new Date(c.created_at) > new Date(to)) return false
      return true
    })
  }, [complaints, status, query, from, to])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages])

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => {
    setFrom(''); setTo(''); setStatus(''); setQuery(''); setPage(1)
  }

  // Handle status update
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await UPDATE_COMPLAINT(complaintId, { status: newStatus })
      setComplaints(prev => prev.map(c =>
        c.id === complaintId ? { ...c, status: newStatus } : c
      ))
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update complaint status')
    }
  }

  // Handle response submission
  const handleSubmitResponse = async () => {
    if (!respondingTo || !responseText.trim()) return

    setSubmitting(true)
    try {
      await UPDATE_COMPLAINT(respondingTo.id, {
        admin_response: responseText,
        status: 'resolved'
      })
      setComplaints(prev => prev.map(c =>
        c.id === respondingTo.id
          ? { ...c, admin_response: responseText, status: 'resolved' }
          : c
      ))
      setRespondingTo(null)
      setResponseText('')
    } catch (err) {
      console.error('Failed to submit response:', err)
      alert('Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <HostelSidebar
      selectedHostelId={selectedHostelId}
      onSelectHostel={setSelectedHostelId}
      title="Complaints & Feedback"
      subtitle="Track and manage tenant complaints and maintenance requests"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 rounded-lg border">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user or text"
              className="px-3 py-2 border rounded w-56"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded">
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border rounded">
              <label className="text-xs text-gray-500">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-sm bg-transparent" />
              <label className="text-xs text-gray-500 ml-2">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-sm bg-transparent" />
            </div>
            <button onClick={clearFilters} className="px-3 py-2 border rounded hover:bg-gray-50">Clear</button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const csv = ['id,user,title,description,category,status,date', ...filtered.map(c => `${c.id},"${c.user_name}","${c.title}","${c.description}",${c.category},${c.status},${c.created_at?.slice(0, 10)}`)].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = 'complaints.csv'; a.click(); URL.revokeObjectURL(url)
              }}
              className="px-3 py-2 border rounded hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No hostel selected */}
        {!selectedHostelId && !loading && (
          <div className="bg-white border rounded-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Select a hostel to view complaints</p>
          </div>
        )}

        {/* Complaints Table */}
        {selectedHostelId && !loading && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing {visible.length} of {total} complaints</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Room</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No complaints found</p>
                        </div>
                      </td>
                    </tr>
                  ) : visible.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{c.user_name}</p>
                          <p className="text-xs text-gray-500">{c.user_email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{c.description}</p>
                      </td>
                      <td className="p-3 capitalize">{c.category}</td>
                      <td className="p-3">{c.room_code || '-'}</td>
                      <td className="p-3">{c.created_at?.slice(0, 10)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CLASSES[c.status] || 'bg-gray-100 text-gray-800'}`}>
                          {c.status === 'pending' ? 'Pending' : 'Resolved'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {c.status !== 'resolved' && (
                            <button
                              onClick={() => {
                                setRespondingTo(c)
                                setResponseText(c.admin_response || '')
                              }}
                              className="px-2 py-1 border rounded text-sm text-green-600 hover:bg-green-50 flex items-center gap-1"
                              title="Respond & Resolve"
                            >
                              <Reply className="w-4 h-4" />
                              Resolve
                            </button>
                          )}
                          {c.status === 'resolved' && c.admin_response && (
                            <button
                              onClick={() => alert(`Admin Response:\n\n${c.admin_response}`)}
                              className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
                            >
                              View Response
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex items-center justify-between bg-gray-50 border-t">
              <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-white">First</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-white">Prev</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-white">Next</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-white">Last</button>
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {respondingTo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-semibold mb-4">Respond to Complaint</h3>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{respondingTo.title}</p>
                <p className="text-sm text-gray-600 mt-1">{respondingTo.description}</p>
                <p className="text-xs text-gray-400 mt-2">From: {respondingTo.user_name}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Write your response to the user..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setRespondingTo(null)
                    setResponseText('')
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !responseText.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {submitting ? 'Sending...' : 'Send & Resolve'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </HostelSidebar>
  )
}

export default Complaints
