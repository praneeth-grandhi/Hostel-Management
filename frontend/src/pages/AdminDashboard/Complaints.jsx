import React, { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import HostelSidebar from '../../components/HostelSidebar'

const SAMPLE = [
  { id: 'C-001', user: 'John Doe', text: 'Leaky faucet in room 101', date: '2024-06-15', status: 'pending' },
  { id: 'C-002', user: 'Asha Patel', text: 'AC not cooling in room 204', date: '2024-06-14', status: 'pending' },
  { id: 'C-003', user: 'Ravi Kumar', text: 'Water supply issue on 3rd floor', date: '2024-06-12', status: 'pending' },
]

const STATUS_CLASSES = {
  pending: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
}

const PAGE_SIZE = 8

const Complaints = () => {
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    // Load complaints for selected hostel (currently using localStorage)
    try {
      const raw = JSON.parse(localStorage.getItem('hostelManagement:complaints') || 'null')
      setComplaints(Array.isArray(raw) && raw.length ? raw : SAMPLE)
    } catch {
      setComplaints(SAMPLE)
    }
  }, [selectedHostelId])

  // Save to localStorage whenever complaints change
  useEffect(() => {
    try {
      localStorage.setItem('hostelManagement:complaints', JSON.stringify(complaints))
    } catch {}
  }, [complaints])

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (status && c.status !== status) return false
      if (query && !(`${c.user} ${c.text}`.toLowerCase().includes(query.toLowerCase()))) return false
      if (from && new Date(c.date) < new Date(from)) return false
      if (to && new Date(c.date) > new Date(to)) return false
      return true
    })
  }, [complaints, status, query, from, to])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages]) // eslint-disable-line

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => {
    setFrom(''); setTo(''); setStatus(''); setQuery(''); setPage(1)
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
                const csv = ['id,user,complaint,date,status', ...filtered.map(c => `${c.id},"${c.user}","${c.text}",${c.date},${c.status}`)].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = 'complaints.csv'; a.click(); URL.revokeObjectURL(url)
              }}
              className="px-3 py-2 border rounded hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                if (!confirm('Mark all pending complaints as Resolved?')) return
                setComplaints(prev => prev.map(c => filtered.includes(c) && c.status === 'pending' ? { ...c, status: 'resolved' } : c))
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Resolve All
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {visible.length} of {total} complaints</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Complaint</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500">No complaints found</p>
                      </div>
                    </td>
                  </tr>
                ) : visible.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{c.id}</td>
                    <td className="p-3">{c.user}</td>
                    <td className="p-3 max-w-xl">{c.text}</td>
                    <td className="p-3">{c.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CLASSES[c.status] || 'bg-gray-100 text-gray-800'}`}>
                        {c.status === 'pending' ? 'Pending' : 'Resolved'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {c.status === 'pending' && (
                          <button
                            onClick={() => setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'resolved' } : x))}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Mark as resolved"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (!confirm('Delete this complaint?')) return
                            setComplaints(prev => prev.filter(x => x.id !== c.id))
                          }}
                          className="px-2 py-1 border rounded text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
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
      </div>
    </HostelSidebar>
  )
}

export default Complaints
