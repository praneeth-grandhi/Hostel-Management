/**
 * Hostel Card Component
 * Displays hostel information in a card format with edit/delete actions
 *
 * @param {object} hostel - Hostel data object
 * @param {function} onEdit - Callback when edit button is clicked
 * @param {function} onDelete - Callback when delete button is clicked
 * @param {boolean} isSelected - Whether this card is currently selected
 * @param {function} onSelect - Callback when card is clicked for selection
 */
const HostelCard = ({ hostel, onEdit, onDelete, isSelected = false, onSelect }) => {
  const typeLabels = {
    hostel: 'Hostel',
    pg: 'Paying Guest',
    dormitory: 'Dormitory',
  }

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(hostel.id)
    }
  }

  return (
    <div
      className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        onSelect ? 'cursor-pointer' : ''
      } ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
      onClick={handleCardClick}
    >
      {/* Card Header with gradient */}
      <div
        className={`px-5 py-4 ${
          isSelected
            ? 'bg-linear-to-r from-blue-600 to-blue-700'
            : 'bg-linear-to-r from-blue-500 to-blue-600'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{hostel.name}</h3>
              {isSelected && (
                <span className="px-2 py-0.5 text-xs font-medium bg-white/30 text-white rounded-full">
                  Active
                </span>
              )}
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
              {typeLabels[hostel.hostel_type] || 'Unknown Type'}
            </span>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(hostel)
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Edit hostel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(hostel.id)
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-red-500/50 rounded-lg transition-colors"
                title="Delete hostel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <div>{hostel.address || '—'}</div>
            <div>
              {[hostel.city, hostel.state, hostel.zip_code].filter(Boolean).join(', ') || '—'}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-600">{hostel.contact_phone || '—'}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-sm text-gray-600">{hostel.rooms || 0} Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-sm text-gray-600">{hostel.floors || 0} Floors</span>
          </div>
          {hostel.food_provided && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-600">Food</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HostelCard
