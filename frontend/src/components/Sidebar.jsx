import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import logo from '../assets/dp.png'

//icons
import { Menu } from 'lucide-react'
import { IoBedOutline } from 'react-icons/io5'
import { BsBuilding } from 'react-icons/bs'
import { SlLogout } from 'react-icons/sl'
import { MdOutlineDashboard } from 'react-icons/md'
import { MdOutlineCalendarMonth } from 'react-icons/md'
import { MdOutlinePeopleAlt } from 'react-icons/md'
import { MdOutlineFeedback } from 'react-icons/md'
import { MdOutlinePayment } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { MdOutlineAnalytics } from 'react-icons/md'
import { MdOutlineSettings } from 'react-icons/md'

const BASE = '/adminDashboard'

const menuItems = [
  {
    icons: <MdOutlineDashboard size={20} />,
    label: 'Dashboard',
    path: '/mainDashboard',
  },
  {
    icons: <IoBedOutline size={20} />,
    label: 'Rooms',
    path: '/rooms',
  },
  {
    icons: <MdOutlineCalendarMonth size={20} />,
    label: 'Bookings',
    path: '/bookings',
  },
  {
    icons: <MdOutlineFeedback size={20} />,
    label: 'Complaints & Feedback',
    path: '/complaints',
  },
  {
    icons: <MdOutlineSettings size={20} />,
    label: 'Settings',
    path: '/settings',
  },
  {
    icons: <SlLogout size={20} />,
    label: 'Logout',
  },
]

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      localStorage.removeItem('hostelManagement:auth')
      window.dispatchEvent(new Event('hostelAuthChange'))
    } catch (e) {}
    navigate('/signin')
  }

  return (
    <nav className={`shadow-md h-screen p-2 flex flex-col duration-300 bg-blue-900 text-white ${isOpen ? 'w-70' : 'w-16'}`}>
      {/* Top section with logo and menu icon */}
      <div className="px-3 py-2 h-20 flex justify-between items-center">
        <img src={logo} alt="pfp" className={`${isOpen ? 'w-10' : 'w-0'} rounded-md duration-300`} />
        <div>
          <Menu
            size={35}
            className={`duration-500 cursor-pointer ${!isOpen && 'rotate-180'}`}
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          />
        </div>
      </div>
      {/* Menu Items */}
      <ul className="flex-1">
        {menuItems.map((item, index) => {
          const isLogout = !item.path
          const to = item.path ? `${BASE}${item.path}` : '/signin'

          return (
            <li key={index} className="px-3 py-2 my-2 hover:bg-blue-950 rounded-md duration-300 cursor-pointer flex items-center relative gap-3 group">
              <Link
                to={to}
                onClick={isLogout ? handleLogout : undefined}
                className={`w-full flex items-center gap-3 ${isOpen ? 'justify-start' : 'justify-center'}`}
              >
                <div className="shrink-0">{item.icons}</div>

                {/* main label: keeps space/layout stable and just fades/collapses text */}
                <p
                  className={`flex-1 ml-2 leading-6 transition-all duration-300 overflow-hidden whitespace-nowrap ${
                    isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                  }`}
                >
                  {item.label}
                </p>

                {/* tooltip for collapsed sidebar */}
                <p
                  className={`absolute left-32 text-black shadow-md rounded-md text-sm bg-white/90 pointer-events-none
                                transition-all duration-200 opacity-0 scale-95 origin-left
                                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                                ${isOpen ? 'hidden' : ''}`}
                >
                  <span className="block px-2 py-1">{item.label}</span>
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
      {/* Footer */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div>
          <FaUserCircle size={30}></FaUserCircle>
        </div>
        <div className={`leading-5 ${!isOpen && 'w-0 translate-x-24 '} duration-300 overflow-hidden`}>
          <p>Praneeth</p>
          <span>praneeth.gsk@gmail.com</span>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
