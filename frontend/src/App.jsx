import { Routes, Route } from 'react-router'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/MainWebsite/HomePage.jsx'
import AboutPage from './pages/MainWebsite/AboutPage.jsx'
import SignInPage from './pages/MainWebsite/SignInPage.jsx'
import DisplayHostelPage from './pages/MainWebsite/DisplayHostelPage.jsx'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import RegisterPage from './pages/MainWebsite/RegisterPage.jsx'
import AdminRegister from './pages/MainWebsite/AdminRegister.jsx'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx'
import MainDashboard from './pages/AdminDashboard/MainDashboard.jsx'
import Bookings from './pages/AdminDashboard/Bookings.jsx'
import Rooms from './pages/AdminDashboard/Rooms.jsx'
import Complaints from './pages/AdminDashboard/Complaints.jsx'
import Settings from './pages/AdminDashboard/Settings.jsx'
import Owners from './pages/AdminDashboard/Owners.jsx'
import HostelDetails from './pages/AdminDashboard/HostelDetails.jsx'
import NotificationAndCommunication from './pages/AdminDashboard/Notification&Communication.jsx'
import SecurityAndAccess from './pages/AdminDashboard/SecurityAndAccess.jsx'
import PastBookings from './pages/UserDashboard/PastBookings.jsx'
import MyHostel from './pages/UserDashboard/MyHostel.jsx'
import Footer from './components/Footer.jsx';
import ProfileSettings from './pages/UserDashboard/ProfileSettings.jsx';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/register/adminregister" element={<AdminRegister />} />
        <Route path="/displayHostel" element={<DisplayHostelPage />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} >
          <Route index element={<MainDashboard />} />
          <Route path="mainDashboard" element={<MainDashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<Settings />} />
            <Route path="hostelDetails" element={<HostelDetails />} />
            <Route path="notificationAndCommunication" element={<NotificationAndCommunication />} />
            <Route path="securityAndAccess" element={<SecurityAndAccess />} />
            <Route path="owners" element={<Owners />} />
          </Route>
        </Route>
        <Route path="/userDashboard/pastBookings" element={<PastBookings />} />
        <Route path="/userDashboard/myHostel" element={<MyHostel />} />
        <Route path="/userDashboard/myProfile" element={<ProfileSettings />} />
        <Route path="/userDashboard/book" element={<HomePage />} />
        <Route path="/userDashboard/profileSettings" element={<ProfileSettings />} />
      </Routes> 
      <Footer />
    </>
  )
}

export default App;
