import React from 'react'
import { useForm } from 'react-hook-form'

const HostelRegistrationForm = ({ adminData, onSubmitSuccess, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      contact_phone: '',
      rooms: '',
      floors: '',
      business_hours: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      console.log('Submitting hostel registration form:', data)
      // Call parent callback with hostel data
      if (onSubmitSuccess) {
        onSubmitSuccess(data)
      }
    } catch (error) {
      console.error('Hostel registration error:', error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Register Your Hostel</h1>
        <p className="text-sm text-gray-600 mb-6">
          Provide basic information about your hostel. You can add more details later.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* ========== HOSTEL BASIC INFO ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hostel Information *</h2>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Hostel Name *</span>
              <input
                type="text"
                placeholder="e.g. My Awesome Hostel"
                {...register('name', { required: 'Hostel name is required' })}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.name ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Address *</span>
              <input
                type="text"
                placeholder="123 Main Street"
                {...register('address', { required: 'Address is required' })}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.address ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">City *</span>
                <input
                  type="text"
                  placeholder="Mumbai"
                  {...register('city', { required: 'City is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.city ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">State *</span>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  {...register('state', { required: 'State is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.state ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Country *</span>
                <input
                  type="text"
                  placeholder="India"
                  {...register('country', { required: 'Country is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.country ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Zip Code *</span>
              <input
                type="text"
                placeholder="400001"
                {...register('zip_code', { required: 'Zip code is required' })}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.zip_code ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.zip_code && <p className="mt-1 text-xs text-red-600">{errors.zip_code.message}</p>}
            </label>
          </div>

          {/* ========== HOSTEL DETAILS ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hostel Details *</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Contact Phone *</span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('contact_phone', { required: 'Contact phone is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.contact_phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.contact_phone && <p className="mt-1 text-xs text-red-600">{errors.contact_phone.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Number of Rooms *</span>
                <input
                  type="number"
                  placeholder="10"
                  {...register('rooms', { required: 'Number of rooms is required', min: { value: 1, message: 'Must be at least 1' } })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.rooms ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.rooms && <p className="mt-1 text-xs text-red-600">{errors.rooms.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Number of Floors *</span>
                <input
                  type="number"
                  placeholder="3"
                  {...register('floors', { required: 'Number of floors is required', min: { value: 1, message: 'Must be at least 1' } })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.floors ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.floors && <p className="mt-1 text-xs text-red-600">{errors.floors.message}</p>}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Business Hours (optional)</span>
              <input
                type="text"
                placeholder="9:00 AM - 9:00 PM"
                {...register('business_hours')}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
              />
            </label>
          </div>

          {/* ========== INFO BOX ========== */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Next Step</h3>
            <p className="text-sm text-blue-800">
              After providing hostel details, you'll be asked to upload documents and provide verification information.
            </p>
          </div>

          {/* ========== BUTTONS ========== */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg text-white font-medium ${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Proceeding...' : 'Continue to Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HostelRegistrationForm
