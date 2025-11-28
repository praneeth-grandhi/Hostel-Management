import React from 'react'

const OffersSection = () => {
  return (
    <section className="offers my-12">
      <div className="max-w-7xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl md:text-3xl font-semibold text-gray-900">Offers & Discounts</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Limited time deals — save more when you book now</p>
          </div>
          <div className="text-sm md:text-base text-gray-500">Valid while stocks last</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="p-6 md:p-8 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl md:text-2.5xl font-semibold">Early Bird</h3>
                <p className="text-sm md:text-base opacity-90 mt-1">Book 30+ days early</p>
              </div>
              <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm md:text-base font-semibold">Save 20%</span>
            </div>
            <p className="text-sm md:text-base opacity-95 mb-6">
              Reserve in advance and enjoy a special discount on selected hostels. Applies to new bookings only.
            </p>
            <div className="mt-auto">
              <button className="inline-block bg-white text-indigo-700 px-4 py-2 rounded-md font-medium hover:opacity-95">
                Learn more
              </button>
            </div>
          </article>

          <article className="p-6 md:p-8 rounded-lg bg-linear-to-r from-green-500 to-teal-500 text-white shadow-md flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl md:text-2.5xl font-semibold">Long Stay</h3>
                <p className="text-sm md:text-base opacity-90 mt-1">Stay 14+ nights</p>
              </div>
              <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm md:text-base font-semibold">Up to 25% off</span>
            </div>
            <p className="text-sm md:text-base opacity-95 mb-6">
              Extended stay discounts for guests staying two weeks or longer. Contact support to apply for monthly rates.
            </p>
            <div className="mt-auto">
              <button className="inline-block bg-white text-green-700 px-4 py-2 rounded-md font-medium hover:opacity-95">
                Apply
              </button>
            </div>
          </article>

          <article className="p-6 md:p-8 rounded-lg bg-linear-to-r from-orange-400 to-rose-500 text-white shadow-md flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl md:text-2.5xl font-semibold">Student Offer</h3>
                <p className="text-sm md:text-base opacity-90 mt-1">Valid student ID</p>
              </div>
              <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm md:text-base font-semibold">10% off</span>
            </div>
            <p className="text-sm md:text-base opacity-95 mb-6">
              Students get a special discount on select rooms with a valid student ID at check-in.
            </p>
            <div className="mt-auto">
              <button className="inline-block bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:opacity-95">
                Redeem
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default OffersSection;