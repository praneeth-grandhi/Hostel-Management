import React, { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'

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
  const [complaints, setComplaints] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    // load from localStorage if present, otherwise sample
    try {
      const raw = JSON.parse(localStorage.getItem('hostelManagement:complaints') || 'null')
      setComplaints(Array.isArray(raw) && raw.length ? raw : SAMPLE)
    } catch {
      setComplaints(SAMPLE)
    }
  }, [])

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
    <div className="min-h-screen w-full p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Complaints</h1>
            <p className="text-sm text-gray-500">Track and manage tenant complaints and maintenance requests.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user or text"
              className="px-3 py-2 border rounded-md shadow-sm w-full sm:w-64"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-md">
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border">
              <label className="text-xs text-gray-500">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="ml-2 text-sm" />
              <label className="text-xs text-gray-500 ml-4">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="ml-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPage(1) }} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
              <button onClick={clearFilters} className="px-3 py-2 border rounded-md">Clear</button>
            </div>
          </div>
        </header>

        <main className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {visible.length} of {total} complaints</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // simple export as CSV
                  const csv = ['id,user,complaint,date,status', ...filtered.map(c => `${c.id},"${c.user}","${c.text}",${c.date},${c.status}`)].join('\n')
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url; a.download = 'complaints.csv'; a.click(); URL.revokeObjectURL(url)
                }}
                className="px-3 py-1.5 border rounded text-sm"
              >
                Export
              </button>
              <button
                onClick={() => {
                  // mark all filtered pending complaints as resolved (demo)
                  if (!confirm('Mark all pending complaints as Resolved?')) return
                  setComplaints(prev => prev.map(c => filtered.includes(c) && c.status === 'pending' ? { ...c, status: 'resolved' } : c))
                }}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
              >
                Resolve All
              </button>
            </div>
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
                    <td colSpan={6} className="p-8 text-center text-gray-500">No complaints found for the selected filters.</td>
                  </tr>
                ) : visible.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{c.id}</td>
                    <td className="p-3">{c.user}</td>
                    <td className="p-3 max-w-xl wrap-break-word">{c.text}</td>
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
                            onClick={() => {
                              setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'resolved' } : x))
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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

          <div className="p-4 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Last</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Complaints
