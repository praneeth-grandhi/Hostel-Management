import React from 'react'
import { Link } from 'react-router'

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-12">
      {/* Hero */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">About Hostel Management</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          We make managing hostels and bookings simple and reliable. Built for owners and guests — from listing rooms and handling bookings to managing complaints and payments.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700">
            Explore Hostels
          </Link>
          <Link to="/contact" className="px-6 py-3 border rounded-xl font-medium text-gray-700 hover:bg-gray-50">
            Contact Us
          </Link>
        </div>
      </header>

      {/* About Us */}
      <section className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <div className="md:flex md:items-start md:gap-10">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">About Us</h2>
            <p className="mt-4 text-base text-gray-700 leading-relaxed">
              Hostel Management is a lightweight platform focused on helping hostel owners manage rooms, tenants and operations while giving guests an easy way to discover, book and review stays.
              Our goal is to reduce administrative overhead so owners can focus on improving the guest experience.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</span>
                <span>Simple booking and payment flows for guests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</span>
                <span>Room, booking and complaint management for owners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</span>
                <span>Local-first demo data — easy to extend to a server</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 md:mt-0 md:w-1/2">
            <div className="rounded-xl overflow-hidden bg-linear-to-br from-blue-600 to-indigo-600 text-white p-8">
              <h3 className="text-xl font-semibold">Why choose us?</h3>
              <p className="mt-3 text-base leading-relaxed text-blue-100">
                Fast setup, focused features and a clean UI that works on mobile and desktop. Perfect for small hostels, PGs and student accommodations.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold">Reliable</div>
                  <div className="text-sm text-blue-100">Stable local demo state and predictable UX.</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold">Secure</div>
                  <div className="text-sm text-blue-100">Local persistence for demos, configurable for servers.</div>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/signin" className="inline-block px-4 py-2 bg-white text-blue-700 rounded-lg font-medium">Get started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="text-3xl">🏨</div>
            <h4 className="mt-4 text-xl font-semibold">Room Listings</h4>
            <p className="mt-2 text-gray-600">Browse room details — type, rent and availability with clear badges so guests can quickly find available rooms.</p>
            <div className="mt-4">
              <Link to="/hostels" className="text-blue-600 font-medium hover:underline">View hostels →</Link>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="text-3xl">🧾</div>
            <h4 className="mt-4 text-xl font-semibold">Bookings & Payments</h4>
            <p className="mt-2 text-gray-600">Simple booking flow with simulated payments for demos, and a history page for past bookings and receipts.</p>
            <div className="mt-4">
              <Link to="/signin" className="text-blue-600 font-medium hover:underline">Book a room →</Link>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="text-3xl">🛠️</div>
            <h4 className="mt-4 text-xl font-semibold">Operations</h4>
            <p className="mt-2 text-gray-600">Owners can review occupancy, manage rooms and resolve complaints from a compact dashboard.</p>
            <div className="mt-4">
              <Link to="/userDashboard" className="text-blue-600 font-medium hover:underline">Manage hostel →</Link>
            </div>
          </article>
        </div>
      </section>

      <footer className="text-center py-8">
        <p className="text-sm text-gray-500">Want to learn more? <Link to="/contact" className="text-blue-600 hover:underline">Contact support</Link> or explore the dashboard to try features.</p>
      </footer>
    </div>
  )
}

export default AboutPage
