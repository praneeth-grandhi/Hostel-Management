import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { FETCH_USER_PERMISSIONS } from '../Data/request'

const PermissionsContext = createContext(null)

export const PermissionsProvider = ({ children }) => {
  const [role, setRole] = useState(null)       // 'admin', 'coadmin', 'user', or null
  const [user, setUser] = useState(null)       // { id, email, first_name, last_name }
  const [loading, setLoading] = useState(true)

  // Derived permissions - frontend logic based on role from backend
  const isAdmin = role === 'admin'
  const isCoAdmin = role === 'coadmin'
  const isAdminOrCoAdmin = isAdmin || isCoAdmin

  const fetchPermissions = useCallback(async () => {
    const auth = JSON.parse(localStorage.getItem('hostelManagement:auth') || '{}')
    
    if (!auth?.authenticated || !auth?.access) {
      setRole(null)
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await FETCH_USER_PERMISSIONS()
      setRole(data.role)
      setUser(data.user)
    } catch (err) {
      console.error('Failed to fetch permissions:', err)
      if (err.response?.status === 401) {
        localStorage.removeItem('hostelManagement:auth')
      }
      setRole(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearPermissions = useCallback(() => {
    setRole(null)
    setUser(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPermissions()
    window.addEventListener('hostelAuthChange', fetchPermissions)
    return () => window.removeEventListener('hostelAuthChange', fetchPermissions)
  }, [fetchPermissions])

  return (
    <PermissionsContext.Provider value={{ 
      role, 
      user, 
      loading,
      isAdmin,
      isCoAdmin,
      isAdminOrCoAdmin,
      refreshPermissions: fetchPermissions, 
      clearPermissions 
    }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider')
  }
  return context
}

export default PermissionsContext
