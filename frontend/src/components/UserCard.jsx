/**
 * User Card Component
 * Displays user/owner information with avatar, role badge, and actions
 *
 * @param {object} user - User data object with firstName, lastName, email, role
 * @param {function} onEdit - Callback when edit button is clicked (optional)
 * @param {function} onDelete - Callback when delete button is clicked (optional)
 * @param {boolean} isCompact - Use compact horizontal layout (default: false)
 */
const UserCard = ({ user, onEdit, onDelete, isCompact = false }) => {
  const initials = `${(user.firstName || user.first_name || '').charAt(0)}${(user.lastName || user.last_name || '').charAt(0)}`.toUpperCase()
  
  const fullName = `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim()
  
  const roleColors = {
    superowner: 'bg-purple-100 text-purple-800',
    admin: 'bg-indigo-100 text-indigo-800',
    owner: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800',
    default: 'bg-gray-100 text-gray-800',
  }

  const avatarColors = {
    superowner: 'bg-purple-600',
    admin: 'bg-indigo-600',
    owner: 'bg-blue-600',
    user: 'bg-gray-600',
    default: 'bg-blue-600',
  }

  const roleColor = roleColors[user.role] || roleColors.default
  const avatarColor = avatarColors[user.role] || avatarColors.default

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 min-w-60 hover:shadow-sm transition-shadow">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center font-medium text-sm shrink-0`}>
          {initials || '?'}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{fullName || 'Unknown User'}</div>
          <div className="text-xs text-gray-500 truncate">{user.email}</div>
          <div className="mt-1">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleColor}`}>
              {user.role || 'user'}
            </span>
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex flex-col gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(user)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(user.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Full card layout
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-full ${avatarColor} text-white flex items-center justify-center font-semibold text-lg shrink-0`}>
          {initials || '?'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">{fullName || 'Unknown User'}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor}`}>
              {user.role || 'user'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          
          {user.createdAt && (
            <p className="text-xs text-gray-400 mt-2">
              Added {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(user)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit user"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(user.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove user"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard
