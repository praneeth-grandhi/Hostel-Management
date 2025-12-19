import { Navigate, Outlet, useLocation } from 'react-router'

/**
 * ProtectedRoute - Controls access to protected pages based on authentication and role
 * 
 * Props:
 * - requiredRole: 'admin' | 'user' | undefined
 *   - 'admin': Only admin/coadmin can access
 *   - 'user': Only regular users can access (admin/coadmin blocked)
 *   - undefined: Any authenticated user can access
 */
const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation()
  
  try {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    
    // Not authenticated - redirect to signin
    if (!auth?.authenticated) {
      return <Navigate to="/signin" replace />
    }

    const isAdminOrCoAdmin = auth.role === 'admin' || auth.role === 'coadmin'

    // Admin routes - allow admin and coadmin
    if (requiredRole === 'admin') {
      if (isAdminOrCoAdmin) {
        return <Outlet />
      }
      // Regular user trying to access admin routes
      return <Navigate to="/" replace />
    }

    // User-only routes - block admin/coadmin
    if (requiredRole === 'user') {
      if (isAdminOrCoAdmin) {
        return <Navigate to="/adminDashboard" replace />
      }
      return <Outlet />
    }

    // No specific role required - check if it's a user dashboard route
    // and block admin/coadmin from accessing it
    if (location.pathname.startsWith('/userDashboard') && isAdminOrCoAdmin) {
      return <Navigate to="/adminDashboard" replace />
    }

    // Authenticated - render the route
    return <Outlet />
  } catch {
    return <Navigate to="/signin" replace />
  }
}

export default ProtectedRoute
