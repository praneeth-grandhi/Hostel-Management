import { Navigate, Outlet } from 'react-router'

/**
 * ProtectedRoute - Prevents unauthenticated users from accessing protected pages
 * 
 * Props:
 * - requiredRole: optional, if specified only users with this role can access
 * 
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}> ... </Route>
 *   <Route element={<ProtectedRoute requiredRole="admin" />}> ... </Route>
 */
const ProtectedRoute = ({ requiredRole }) => {
  try {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    
    // Not authenticated - redirect to signin
    if (!auth?.authenticated) {
      return <Navigate to="/signin" replace />
    }
    
    // If a specific role is required, check it
    if (requiredRole && auth.role !== requiredRole) {
      // Wrong role - redirect to appropriate page
      if (auth.role === 'admin') {
        return <Navigate to="/adminDashboard" replace />
      } else {
        return <Navigate to="/" replace />
      }
    }
    
    // Authenticated (and correct role if required) - render the route
    return <Outlet />
  } catch {
    // Invalid auth data - redirect to signin
    return <Navigate to="/signin" replace />
  }
}

export default ProtectedRoute
