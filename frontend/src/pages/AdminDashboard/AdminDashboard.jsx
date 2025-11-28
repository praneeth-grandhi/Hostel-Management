import Sidebar from '../../components/Sidebar.jsx'
import { Outlet } from 'react-router'

const AdminDashboard = () => {
  return (
    // make parent full viewport height so children can use min-h-0 correctly
    <div className='flex h-screen'>
      <Sidebar />
      {/* allow main to shrink and scroll its content */}
      <main className='flex-1 p-6 bg-gray-100 min-h-0 overflow-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminDashboard
