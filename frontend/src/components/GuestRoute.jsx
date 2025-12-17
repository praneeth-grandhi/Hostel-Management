import { Navigate, Outlet } from 'react-router'

/**
 * GuestRoute - Prevents authenticated users from accessing guest-only pages (login, register)
 * 
 * If user is already logged in:
 * - Admin → redirects to /adminDashboard
 * - User → redirects to /
 * 
 * Usage in App.jsx:
 *   <Route element={<GuestRoute />}>
 *     <Route path="/signin" element={<SignInPage />} />
 *   </Route>
 */
const GuestRoute = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth'))
    
    // If authenticated, redirect based on role
    if (auth?.authenticated) {
      if (auth.role === 'admin') {
        return <Navigate to="/adminDashboard" replace />
      } else {
        return <Navigate to="/" replace />
      }
    }
    
    // Not authenticated - allow access to guest pages
    return <Outlet />
  } catch {
    // Invalid auth data - allow access to guest pages
    return <Outlet />
  }
}

export default GuestRoute
